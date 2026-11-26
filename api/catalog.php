<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/includes/bootstrap.php';

ini_set('display_errors', '0');
ini_set('log_errors', '1');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

if (!$pdo) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Base de données indisponible. Vérifiez config.php et la connexion MySQL.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "SELECT id, slug, name, title, element, weapon, rarity, region, description,
                   COALESCE(NULLIF(card_url, ''), NULLIF(image_url, '')) AS card_url,
                   COALESCE(NULLIF(splash_url, ''), NULLIF(card_url, ''), NULLIF(image_url, '')) AS splash_url
            FROM characters
            WHERE is_published = 1
            ORDER BY rarity DESC, name ASC";
    $characters = $pdo->query($sql)->fetchAll();
    foreach ($characters as &$character) {
        $character['id'] = (string)($character['slug'] ?: $character['id']);
        $character['rarity'] = (int)$character['rarity'];
    }
    unset($character);

    echo json_encode([
        'ok' => true,
        'source' => 'teyvat-chronicles-database',
        'total' => count($characters),
        'characters' => $characters
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    error_log('Local catalog error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Le catalogue local est indisponible. Vérifiez la migration SQL.'], JSON_UNESCAPED_UNICODE);
}
