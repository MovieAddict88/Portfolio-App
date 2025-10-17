<?php
// PWA Installation Checker
header('Content-Type: application/json');

$checks = [
    'https' => false,
    'manifest' => false,
    'service_worker' => false,
    'icons' => false,
    'errors' => []
];

// Check HTTPS
$checks['https'] = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
                   (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ||
                   $_SERVER['HTTP_HOST'] === 'localhost';

if (!$checks['https']) {
    $checks['errors'][] = 'HTTPS is required for PWA installation';
}

// Check Manifest
$manifestPath = __DIR__ . '/manifest.json';
if (file_exists($manifestPath)) {
    $manifest = json_decode(file_get_contents($manifestPath), true);
    $checks['manifest'] = !empty($manifest) && isset($manifest['name']) && isset($manifest['icons']);
    if (!$checks['manifest']) {
        $checks['errors'][] = 'Manifest file is invalid or missing required fields';
    }
} else {
    $checks['errors'][] = 'Manifest file not found';
}

// Check Service Worker
$swPath = __DIR__ . '/sw.js';
$checks['service_worker'] = file_exists($swPath);
if (!$checks['service_worker']) {
    $checks['errors'][] = 'Service Worker file not found';
}

// Check Icons
$iconsDir = __DIR__ . '/icons';
$requiredIcons = ['icon-72x72.png', 'icon-192x192.png', 'icon-512x512.png'];
$foundIcons = 0;

if (is_dir($iconsDir)) {
    foreach ($requiredIcons as $icon) {
        if (file_exists($iconsDir . '/' . $icon)) {
            $foundIcons++;
        }
    }
}

$checks['icons'] = $foundIcons === count($requiredIcons);
if (!$checks['icons']) {
    $checks['errors'][] = 'Missing required icon files';
}

// Calculate overall status
$allChecks = $checks['https'] && $checks['manifest'] && $checks['service_worker'] && $checks['icons'];
$checks['ready_for_installation'] = $allChecks;

// Add installation instructions
$checks['instructions'] = [
    'desktop' => 'Look for install button in address bar or browser menu',
    'android' => 'Chrome menu → Add to Home Screen',
    'ios' => 'Safari share button → Add to Home Screen'
];

echo json_encode($checks, JSON_PRETTY_PRINT);
?>