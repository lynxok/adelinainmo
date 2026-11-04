<?php
// =========================================================================
// ADELINA INMOBILIARIA - SECURE IMAGE SERVER (OUTSIDE PUBLIC_HTML)
// =========================================================================

$filename = isset($_GET['f']) ? basename(trim($_GET['f'])) : '';
$folder = (isset($_GET['folder']) && $_GET['folder'] === 'testimonials') ? 'testimonials' : 'properties';

// 1. Validar nombre seguro: solo caracteres alfanumericos, guiones, puntos
if (empty($filename) || !preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
    http_response_code(400);
    exit('Invalid image filename');
}

// 2. Validar extensiones de imagen permitidas (SVG excluido)
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowedExtensions = ['webp', 'jpg', 'jpeg', 'png', 'gif'];

if (!in_array($ext, $allowedExtensions, true)) {
    http_response_code(403);
    exit('Forbidden file extension');
}

// 3. Resolver ruta persistente fuera de public_html
$hostingerDataDir = '/home/u675372216/domains/adelinainmo.lnx.com.ar/data';
if (is_dir('/home/u675372216/domains/adelinainmo.lnx.com.ar')) {
    $dataDir = $hostingerDataDir;
} elseif (isset($_SERVER['DOCUMENT_ROOT']) && is_dir($_SERVER['DOCUMENT_ROOT'])) {
    $dataDir = dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/data';
} else {
    $dataDir = dirname(__DIR__) . '/data';
}

$targetPath = $dataDir . '/uploads/' . $folder . '/' . $filename;

// Fallback de transicion si no existe en data/ pero existe en public_html/uploads/
if (!file_exists($targetPath)) {
    $legacyPath = __DIR__ . '/uploads/' . $folder . '/' . $filename;
    if (file_exists($legacyPath)) {
        if (is_dir($dataDir)) {
            $destDir = $dataDir . '/uploads/' . $folder;
            if (!is_dir($destDir)) @mkdir($destDir, 0755, true);
            @copy($legacyPath, $targetPath);
        }
        $targetPath = $legacyPath;
    }
}

if (!file_exists($targetPath)) {
    http_response_code(404);
    exit('Image not found');
}

// 4. Validar tipo MIME real del archivo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$realMime = finfo_file($finfo, $targetPath);
finfo_close($finfo);

$allowedRealMimes = [
    'image/jpeg' => true,
    'image/png'  => true,
    'image/webp' => true,
    'image/gif'  => true
];

if (!isset($allowedRealMimes[$realMime])) {
    http_response_code(403);
    exit('Forbidden: Invalid image MIME type');
}

// 5. Cabeceras de seguridad y cache larga e inmutable (1 anio)
$lastModified = filemtime($targetPath);
$fileSize = filesize($targetPath);
$etag = '"' . md5($filename . $lastModified . $fileSize) . '"';

header('X-Content-Type-Options: nosniff');
header('Content-Type: ' . $realMime);
header('Content-Length: ' . $fileSize);
header('Cache-Control: public, max-age=31536000, immutable');
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000));
header('Last-Modified: ' . gmdate('D, d M Y H:i:s \G\M\T', $lastModified));
header('ETag: ' . $etag);

// Manejar 304 Not Modified
if (
    (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) === $etag) ||
    (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) && strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= $lastModified)
) {
    http_response_code(304);
    exit;
}

readfile($targetPath);
exit;
