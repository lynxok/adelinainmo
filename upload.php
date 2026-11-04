<?php
// Endpoint de subida segura de imágenes para Adelina Inmobiliaria (Hostinger)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Upload-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 1. Validar Token de Sesión leyendo db_store.json
function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        } elseif (isset($requestHeaders['authorization'])) {
            $headers = trim($requestHeaders['authorization']);
        }
    }
    if (!empty($headers) && preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
        return $matches[1];
    }
    return null;
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

function isSessionValid($token) {
    global $dataDir;
    if (!$token) return false;
    $dbFile = $dataDir . '/db_store.json';
    if (!file_exists($dbFile)) {
        $dbFile = __DIR__ . '/uploads/db_store.json';
    }
    if (!file_exists($dbFile)) return false;
    $raw = @file_get_contents($dbFile);
    $data = @json_decode($raw, true);
    if (!isset($data['sessions']) || !is_array($data['sessions'])) return false;
    $tokenHash = hash('sha256', $token);
    $now = time();
    foreach ($data['sessions'] as $session) {
        if (isset($session['token_hash']) && hash_equals($session['token_hash'], $tokenHash)) {
            if (isset($session['expires_at']) && $session['expires_at'] > $now) {
                return true;
            }
        }
    }
    return false;
}

$token = getBearerToken();
$isValid = isSessionValid($token);

// Opcional: autenticación para scripts locales/CLI via variable de entorno en servidor
if (!$isValid) {
    $envSecret = getenv('ADELINA_SECRET_KEY');
    $providedKey = $_SERVER['HTTP_X_UPLOAD_KEY'] ?? '';
    if (!empty($envSecret) && !empty($providedKey) && hash_equals($envSecret, $providedKey)) {
        $isValid = true;
    }
}

if (!$isValid) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Valid session token required']);
    exit;
}

// 2. Validar archivo recibido
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['file'];

// Límite de tamaño: 10MB
if ($file['size'] > 10 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large (max 10MB)']);
    exit;
}

// 3. Validar tipo MIME
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif'
];

if (!isset($allowedMimes[$mimeType])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid image format. Allowed: webp, jpg, png, gif']);
    exit;
}

$ext = $allowedMimes[$mimeType];

// 4. Directorio de destino persistente fuera de public_html
$folder = isset($_POST['folder']) && $_POST['folder'] === 'testimonials' ? 'testimonials' : 'properties';
$uploadDir = $dataDir . '/uploads/' . $folder . '/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 5. Nombre único y seguro
$customName = isset($_POST['custom_name']) ? trim($_POST['custom_name']) : '';
if (!empty($customName)) {
    // Sanitizar custom_name manteniendo solo caracteres seguros y extensión
    $filename = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $customName);
    if (!preg_match('/\.(jpg|jpeg|png|webp|gif)$/i', $filename)) {
        $filename .= '.' . $ext;
    }
} else {
    $cleanBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '', pathinfo($file['name'], PATHINFO_FILENAME));
    if (empty($cleanBaseName)) {
        $cleanBaseName = 'prop';
    }
    $filename = $cleanBaseName . '-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
}
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file on server']);
    exit;
}

// 6. Construir URL pública absoluta
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 ? "https://" : "https://";
$host = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . $host . '/uploads/' . $folder . '/' . $filename;

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'url' => $publicUrl,
    'filename' => $filename
]);
