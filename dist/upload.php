<?php
// Endpoint de subida segura de imágenes para Adelina Inmobiliaria (Hostinger)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Upload-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// 1. Validar Token Secreto
$SECRET_KEY = 'adelina_inmo_secret_upload_key_2026';
$providedKey = $_SERVER['HTTP_X_UPLOAD_KEY'] ?? ($_POST['key'] ?? '');

if ($providedKey !== $SECRET_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
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

// 4. Directorio de destino
$folder = isset($_POST['folder']) && $_POST['folder'] === 'testimonials' ? 'testimonials' : 'properties';
$uploadDir = __DIR__ . '/uploads/' . $folder . '/';

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
