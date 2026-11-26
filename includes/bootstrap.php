<?php
declare(strict_types=1);

function e(?string $value): string {
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$configFile = dirname(__DIR__) . '/config.php';
if (is_file($configFile)) {
    $config = require $configFile;
    if (is_array($config) && !empty($config['db']['host'])) {
        try {
            $db = $config['db'];
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $db['host'], $db['name']);
            $pdo = new PDO($dsn, $db['user'], $db['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (Throwable $exception) {
            error_log('Database connection failed: ' . $exception->getMessage());
            $pdo = null;
        }
    } else {
        $pdo = null;
    }
} else {
    $pdo = null;
}
