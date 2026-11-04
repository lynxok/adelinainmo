<?php
// =========================================================================
// ADELINA INMOBILIARIA - HOSTINGER NATIVE DATABASE API (JSON STORE)
// =========================================================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Upload-Key');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$hostingerDataDir = '/home/u675372216/domains/adelinainmo.lnx.com.ar/data';
if (is_dir('/home/u675372216/domains/adelinainmo.lnx.com.ar')) {
    $dataDir = $hostingerDataDir;
} elseif (isset($_SERVER['DOCUMENT_ROOT']) && is_dir($_SERVER['DOCUMENT_ROOT'])) {
    $dataDir = dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/data';
} else {
    $dataDir = dirname(__DIR__) . '/data';
}

if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$dbFile = $dataDir . '/db_store.json';
$bakFile = $dataDir . '/db_store.bak.json';
$baseDir = isset($_SERVER['DOCUMENT_ROOT']) && is_dir($_SERVER['DOCUMENT_ROOT']) ? rtrim($_SERVER['DOCUMENT_ROOT'], '/\\') : __DIR__;
$seedFile = file_exists($baseDir . '/seed_db.json') ? $baseDir . '/seed_db.json' : __DIR__ . '/seed_db.json';

// Auto-migración al inicio si aún no existe en data/ pero existe en uploads/
if (!file_exists($dbFile)) {
    $legacyDb = $baseDir . '/uploads/db_store.json';
    if (file_exists($legacyDb)) {
        @copy($legacyDb, $dbFile);
    }
}

// Asegurar directorios de uploads persistentes fuera de public_html
$persistentUploads = $dataDir . '/uploads';
if (!is_dir($persistentUploads)) {
    @mkdir($persistentUploads, 0755, true);
    @mkdir($persistentUploads . '/properties', 0755, true);
    @mkdir($persistentUploads . '/testimonials', 0755, true);
}

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
        $seed['sessions'] = [];
        saveDatabase($dbFile, $GLOBALS['bakFile'], $seed);
        return $seed;
    }

    $raw = @file_get_contents($dbFile);
    $db = @json_decode($raw, true);
    if (!is_array($db)) {
        $seed['deleted_ids'] = [];
        $seed['passwords'] = [];
        $seed['sessions'] = [];
        saveDatabase($dbFile, $GLOBALS['bakFile'], $seed);
        return $seed;
    }

    if (!isset($db['deleted_ids']) || !is_array($db['deleted_ids'])) {
        $db['deleted_ids'] = [];
    }
    if (!isset($db['passwords']) || !is_array($db['passwords'])) {
        $db['passwords'] = [];
    }
    if (!isset($db['sessions']) || !is_array($db['sessions'])) {
        $db['sessions'] = [];
    }

    // Prune expired sessions (12h TTL)
    $now = time();
    $activeSessions = [];
    foreach ($db['sessions'] as $sess) {
        if (isset($sess['expires_at']) && $sess['expires_at'] > $now) {
            $activeSessions[] = $sess;
        }
    }
    $changed = false;
    if (count($activeSessions) !== count($db['sessions'])) {
        $db['sessions'] = $activeSessions;
        $changed = true;
    }

    // Merge missing seed items that were never explicitly deleted
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

function getBearerToken() {
    $authHeader = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $authHeader = trim($requestHeaders['Authorization']);
        } elseif (isset($requestHeaders['authorization'])) {
            $authHeader = trim($requestHeaders['authorization']);
        }
    }
    if (!empty($authHeader) && preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        return $matches[1];
    }
    return null;
}

function authenticateRequest(&$db) {
    $token = getBearerToken();
    if ($token && isset($db['sessions']) && is_array($db['sessions'])) {
        $tokenHash = hash('sha256', $token);
        $now = time();
        foreach ($db['sessions'] as $session) {
            if (isset($session['token_hash']) && hash_equals($session['token_hash'], $tokenHash)) {
                if (isset($session['expires_at']) && $session['expires_at'] > $now) {
                    return $session;
                }
            }
        }
    }
    // Server-side CLI fallback with environment variable
    $envSecret = getenv('ADELINA_SECRET_KEY');
    $xUploadKey = isset($_SERVER['HTTP_X_UPLOAD_KEY']) ? $_SERVER['HTTP_X_UPLOAD_KEY'] : '';
    if (!empty($envSecret) && !empty($xUploadKey) && hash_equals($envSecret, $xUploadKey)) {
        return ['role' => 'superadmin', 'email' => 'cli@system'];
    }
    return null;
}

$db = loadDatabase($dbFile, $seedFile);

// GET REQUESTS (Public: properties, categories, testimonials; Admin: leads, profiles)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $table = isset($_GET['table']) ? $_GET['table'] : 'all';
    $publicTables = ['properties', 'categories', 'testimonials'];
    $adminTables = ['leads', 'profiles'];

    $session = authenticateRequest($db);

    if ($table === 'all') {
        $response = [
            'success' => true,
            'properties' => isset($db['properties']) ? $db['properties'] : [],
            'categories' => isset($db['categories']) ? $db['categories'] : [],
            'testimonials' => isset($db['testimonials']) ? $db['testimonials'] : []
        ];
        if ($session) {
            $response['leads'] = isset($db['leads']) ? $db['leads'] : [];
            $response['profiles'] = isset($db['profiles']) ? $db['profiles'] : [];
        }
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (in_array($table, $adminTables, true)) {
        if (!$session) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Valid admin token required']);
            exit;
        }
        echo json_encode([
            'success' => true,
            'data' => isset($db[$table]) ? $db[$table] : []
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (in_array($table, $publicTables, true)) {
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
    $publicActions = ['increment_view', 'create_lead', 'login'];

    $session = authenticateRequest($db);

    if (!in_array($action, $publicActions, true) && !$session) {
        http_response_code(403);
        echo json_encode(['error' => 'Unauthorized: Valid admin token required']);
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

        // Check stored password hash
        if (isset($db['passwords'][$email])) {
            if (!password_verify($password, $db['passwords'][$email])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid login credentials']);
                exit;
            }
        } else {
            // First login password bind: preserved per instructions until user confirms
            $db['passwords'][$email] = password_hash($password, PASSWORD_DEFAULT);
        }

        // Generate 32-byte secure session token
        $sessionToken = bin2hex(random_bytes(32));
        $sessionHash = hash('sha256', $sessionToken);
        $expiresAt = time() + (12 * 3600); // 12 hours

        if (!isset($db['sessions']) || !is_array($db['sessions'])) {
            $db['sessions'] = [];
        }

        // Remove old sessions for this email
        $db['sessions'] = array_values(array_filter($db['sessions'], function($s) use ($email) {
            return !isset($s['email']) || $s['email'] !== $email;
        }));

        $db['sessions'][] = [
            'token_hash' => $sessionHash,
            'email' => $email,
            'role' => $foundProfile['role'],
            'created_at' => time(),
            'expires_at' => $expiresAt
        ];

        saveDatabase($dbFile, $bakFile, $db);

        echo json_encode([
            'success' => true,
            'token' => $sessionToken,
            'user' => [
                'id' => $foundProfile['id'],
                'email' => $foundProfile['email'],
                'full_name' => isset($foundProfile['full_name']) ? $foundProfile['full_name'] : '',
                'role' => $foundProfile['role']
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // 2. LOGOUT
    if ($action === 'logout') {
        $token = getBearerToken();
        if ($token) {
            $tokenHash = hash('sha256', $token);
            if (isset($db['sessions']) && is_array($db['sessions'])) {
                $db['sessions'] = array_values(array_filter($db['sessions'], function($s) use ($tokenHash) {
                    return !isset($s['token_hash']) || !hash_equals($s['token_hash'], $tokenHash);
                }));
                saveDatabase($dbFile, $bakFile, $db);
            }
        }
        echo json_encode(['success' => true]);
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
        if (!isset($session['role']) || $session['role'] !== 'superadmin') {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Superadmin role required']);
            exit;
        }

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
            'role' => $role,
            'full_name' => $fullName,
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
        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        $sessionEmail = isset($session['email']) ? strtolower(trim($session['email'])) : '';
        $isSelf = ($sessionEmail && $sessionEmail === $email);
        $isSuperadmin = (isset($session['role']) && $session['role'] === 'superadmin');

        if (!$isSelf && !$isSuperadmin) {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Only superadmin or account owner can change password']);
            exit;
        }

        $db['passwords'][$email] = password_hash($password, PASSWORD_DEFAULT);
        saveDatabase($dbFile, $bakFile, $db);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($action === 'update_role') {
        if (!isset($session['role']) || $session['role'] !== 'superadmin') {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Superadmin role required']);
            exit;
        }

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
