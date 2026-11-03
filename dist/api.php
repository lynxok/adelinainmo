<?php
// =========================================================================
// ADELINA INMOBILIARIA - HOSTINGER NATIVE DATABASE API (JSON STORE)
// =========================================================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Upload-Key, Authorization');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$SECRET_KEY = 'adelina_inmo_secret_upload_key_2026';
$baseDir = isset($_SERVER['DOCUMENT_ROOT']) && is_dir($_SERVER['DOCUMENT_ROOT']) ? rtrim($_SERVER['DOCUMENT_ROOT'], '/\\') : __DIR__;
$uploadsDir = $baseDir . '/uploads';
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0755, true);
}

$dbFile = $uploadsDir . '/db_store.json';
$bakFile = $uploadsDir . '/db_store.bak.json';
$seedFile = file_exists($baseDir . '/seed_db.json') ? $baseDir . '/seed_db.json' : __DIR__ . '/seed_db.json';

function loadSeedData($seedFile) {
    if (file_exists($seedFile)) {
        $raw = @file_get_contents($seedFile);
        $data = @json_decode($raw, true);
        if (is_array($data)) {
            return $data;
        }
    }
    return [
        'version' => 2,
        'properties' => [],
        'categories' => [],
        'testimonials' => [],
        'leads' => [],
        'profiles' => []
    ];
}

function loadDatabase($dbFile, $seedFile) {
    $seed = loadSeedData($seedFile);
    if (!file_exists($dbFile)) {
        $seed['deleted_ids'] = [];
        $seed['passwords'] = [];
        saveDatabase($dbFile, $GLOBALS['bakFile'], $seed);
        return $seed;
    }

    $raw = @file_get_contents($dbFile);
    $db = @json_decode($raw, true);
    if (!is_array($db)) {
        $seed['deleted_ids'] = [];
        $seed['passwords'] = [];
        saveDatabase($dbFile, $GLOBALS['bakFile'], $seed);
        return $seed;
    }

    if (!isset($db['deleted_ids']) || !is_array($db['deleted_ids'])) {
        $db['deleted_ids'] = [];
    }
    if (!isset($db['passwords']) || !is_array($db['passwords'])) {
        $db['passwords'] = [];
    }

    // Merge missing seed items that were never explicitly deleted
    $changed = false;
    foreach (['properties', 'categories', 'testimonials', 'profiles'] as $col) {
        if (!isset($db[$col]) || !is_array($db[$col])) {
            $db[$col] = [];
        }
        $existingIds = [];
        foreach ($db[$col] as $item) {
            if (isset($item['id'])) {
                $existingIds[$item['id']] = true;
            }
        }
        if (isset($seed[$col]) && is_array($seed[$col])) {
            foreach ($seed[$col] as $seedItem) {
                $sid = isset($seedItem['id']) ? $seedItem['id'] : null;
                if ($sid && !isset($existingIds[$sid]) && !in_array($sid, $db['deleted_ids'], true)) {
                    $db[$col][] = $seedItem;
                    $changed = true;
                }
            }
        }
    }

    if (!isset($db['leads']) || !is_array($db['leads'])) {
        $db['leads'] = [];
    }

    if ($changed) {
        saveDatabase($dbFile, $GLOBALS['bakFile'], $db);
    }

    return $db;
}

function saveDatabase($dbFile, $bakFile, $db) {
    $json = json_encode($db, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return false;
    }
    if (file_exists($dbFile)) {
        @copy($dbFile, $bakFile);
    }
    $res = @file_put_contents($dbFile, $json, LOCK_EX);
    return $res !== false;
}

$db = loadDatabase($dbFile, $seedFile);

// GET REQUESTS (Public Read)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $table = isset($_GET['table']) ? $_GET['table'] : 'all';
    $allowedTables = ['properties', 'categories', 'testimonials', 'leads', 'profiles'];

    if ($table === 'all') {
        echo json_encode([
            'success' => true,
            'properties' => $db['properties'],
            'categories' => $db['categories'],
            'testimonials' => $db['testimonials'],
            'leads' => $db['leads'],
            'profiles' => $db['profiles']
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (in_array($table, $allowedTables, true)) {
        echo json_encode([
            'success' => true,
            'data' => isset($db[$table]) ? $db[$table] : []
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Invalid table parameter']);
    exit;
}

// POST REQUESTS (Mutations & Auth)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $body = @json_decode($rawInput, true);
    if (!is_array($body)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body']);
        exit;
    }

    $action = isset($body['action']) ? $body['action'] : '';

    // Public action: increment_view or create_lead can be called from public site,
    // or authenticated via X-Upload-Key
    $providedKey = isset($_SERVER['HTTP_X_UPLOAD_KEY']) ? $_SERVER['HTTP_X_UPLOAD_KEY'] : (isset($body['key']) ? $body['key'] : '');
    $publicActions = ['increment_view', 'create_lead', 'login'];

    if (!in_array($action, $publicActions, true) && $providedKey !== $SECRET_KEY) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized: Invalid key']);
        exit;
    }

    // 1. LOGIN
    if ($action === 'login') {
        $email = isset($body['email']) ? strtolower(trim($body['email'])) : '';
        $password = isset($body['password']) ? $body['password'] : '';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        $foundProfile = null;
        foreach ($db['profiles'] as $prof) {
            if (strtolower(trim($prof['email'])) === $email) {
                $foundProfile = $prof;
                break;
            }
        }

        if (!$foundProfile) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid login credentials']);
            exit;
        }

        // Check stored password hash; if not set yet for migrated superadmins, bind on first login
        if (isset($db['passwords'][$email])) {
            if (!password_verify($password, $db['passwords'][$email])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid login credentials']);
                exit;
            }
        } else {
            $db['passwords'][$email] = password_hash($password, PASSWORD_DEFAULT);
            saveDatabase($dbFile, $bakFile, $db);
        }

        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $foundProfile['id'],
                'email' => $foundProfile['email'],
                'full_name' => isset($foundProfile['full_name']) ? $foundProfile['full_name'] : '',
                'role' => $foundProfile['role']
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // 2. UPSERT (Single item in properties, categories, testimonials, leads, profiles)
    if ($action === 'upsert') {
        $table = isset($body['table']) ? $body['table'] : '';
        $item = isset($body['item']) ? $body['item'] : null;
        $allowedTables = ['properties', 'categories', 'testimonials', 'leads', 'profiles'];

        if (!in_array($table, $allowedTables, true) || !is_array($item) || empty($item['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid table or item']);
            exit;
        }

        $id = $item['id'];
        // Remove from deleted_ids if re-inserted
        $db['deleted_ids'] = array_values(array_diff($db['deleted_ids'], [$id]));

        $updated = false;
        foreach ($db[$table] as $idx => $existing) {
            if (isset($existing['id']) && $existing['id'] === $id) {
                $db[$table][$idx] = array_merge($existing, $item);
                $updated = true;
                break;
            }
        }
        if (!$updated) {
            array_unshift($db[$table], $item);
        }

        saveDatabase($dbFile, $bakFile, $db);
        echo json_encode(['success' => true, 'item' => $item], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // 3. BULK UPSERT (Sync missing local items)
    if ($action === 'bulk_upsert') {
        $table = isset($body['table']) ? $body['table'] : '';
        $items = isset($body['items']) ? $body['items'] : null;
        $allowedTables = ['properties', 'categories', 'testimonials', 'leads', 'profiles'];

        if (!in_array($table, $allowedTables, true) || !is_array($items)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid table or items']);
            exit;
        }

        foreach ($items as $item) {
            if (!is_array($item) || empty($item['id'])) continue;
            $id = $item['id'];
            $updated = false;
            foreach ($db[$table] as $idx => $existing) {
                if (isset($existing['id']) && $existing['id'] === $id) {
                    $db[$table][$idx] = array_merge($existing, $item);
                    $updated = true;
                    break;
                }
            }
            if (!$updated) {
                array_unshift($db[$table], $item);
            }
        }

        saveDatabase($dbFile, $bakFile, $db);
        echo json_encode(['success' => true, 'count' => count($db[$table])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // 4. DELETE
    if ($action === 'delete') {
        $table = isset($body['table']) ? $body['table'] : '';
        $id = isset($body['id']) ? $body['id'] : '';
        $allowedTables = ['properties', 'categories', 'testimonials', 'leads', 'profiles'];

        if (!in_array($table, $allowedTables, true) || !$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid table or id']);
            exit;
        }

        if (!in_array($id, $db['deleted_ids'], true)) {
            $db['deleted_ids'][] = $id;
        }

        $newList = [];
        foreach ($db[$table] as $existing) {
            if (!isset($existing['id']) || $existing['id'] !== $id) {
                $newList[] = $existing;
            }
        }
        $db[$table] = $newList;

        saveDatabase($dbFile, $bakFile, $db);
        echo json_encode(['success' => true, 'deleted_id' => $id]);
        exit;
    }

    // 5. INCREMENT VIEW
    if ($action === 'increment_view') {
        $id = isset($body['id']) ? $body['id'] : '';
        if ($id) {
            foreach ($db['properties'] as $idx => $prop) {
                if (isset($prop['id']) && $prop['id'] === $id) {
                    $current = isset($prop['views_count']) ? (int)$prop['views_count'] : 0;
                    $db['properties'][$idx]['views_count'] = $current + 1;
                    saveDatabase($dbFile, $bakFile, $db);
                    break;
                }
            }
        }
        echo json_encode(['success' => true]);
        exit;
    }

    // 6. CREATE LEAD
    if ($action === 'create_lead') {
        $item = isset($body['item']) ? $body['item'] : null;
        if (is_array($item) && !empty($item['id'])) {
            array_unshift($db['leads'], $item);
            saveDatabase($dbFile, $bakFile, $db);
            echo json_encode(['success' => true, 'item' => $item]);
            exit;
        }
        http_response_code(400);
        echo json_encode(['error' => 'Invalid lead item']);
        exit;
    }

    // 7. USER MANAGEMENT (create_user, update_password, update_role)
    if ($action === 'create_user') {
        $email = isset($body['email']) ? strtolower(trim($body['email'])) : '';
        $password = isset($body['password']) ? $body['password'] : '';
        $fullName = isset($body['full_name']) ? trim($body['full_name']) : '';
        $role = isset($body['role']) ? $body['role'] : 'corredor';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        foreach ($db['profiles'] as $prof) {
            if (strtolower(trim($prof['email'])) === $email) {
                http_response_code(400);
                echo json_encode(['error' => 'User already exists']);
                exit;
            }
        }

        $newProfile = [
            'id' => 'usr-' . time() . '-' . substr(md5($email), 0, 6),
            'email' => $email,
            'full_name' => $fullName,
            'role' => $role,
            'created_at' => gmdate('Y-m-d\TH:i:s\Z'),
            'updated_at' => gmdate('Y-m-d\TH:i:s\Z')
        ];
        $db['profiles'][] = $newProfile;
        $db['passwords'][$email] = password_hash($password, PASSWORD_DEFAULT);
        saveDatabase($dbFile, $bakFile, $db);

        echo json_encode(['success' => true, 'profile' => $newProfile]);
        exit;
    }

    if ($action === 'update_password') {
        $email = isset($body['email']) ? strtolower(trim($body['email'])) : '';
        $password = isset($body['password']) ? $body['password'] : '';
        if ($email && $password) {
            $db['passwords'][$email] = password_hash($password, PASSWORD_DEFAULT);
            saveDatabase($dbFile, $bakFile, $db);
            echo json_encode(['success' => true]);
            exit;
        }
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
        exit;
    }

    if ($action === 'update_role') {
        $id = isset($body['id']) ? $body['id'] : '';
        $role = isset($body['role']) ? $body['role'] : '';
        foreach ($db['profiles'] as $idx => $prof) {
            if (isset($prof['id']) && $prof['id'] === $id) {
                $db['profiles'][$idx]['role'] = $role;
                saveDatabase($dbFile, $bakFile, $db);
                echo json_encode(['success' => true]);
                exit;
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Profile not found']);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
