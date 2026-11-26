<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/includes/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

if (!$pdo) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'Base de données non configurée. Importez database/schema.sql et créez config.php.']);
    exit;
}

$element = trim((string)($_GET['element'] ?? ''));
$search = trim((string)($_GET['q'] ?? ''));

$sql = 'SELECT id, slug, name, title, element, weapon, rarity, region, description, image_url, card_url, splash_url FROM characters WHERE is_published = 1';
$params = [];
if ($element !== '' && $element !== 'all') {
    $sql .= ' AND element = :element';
    $params['element'] = $element;
}
if ($search !== '') {
    $sql .= ' AND (name LIKE :search OR title LIKE :search OR region LIKE :search)';
    $params['search'] = '%' . substr($search, 0, 80) . '%';
}
$sql .= ' ORDER BY rarity DESC, name ASC LIMIT 100';

try {
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    echo json_encode(['ok' => true, 'characters' => $statement->fetchAll()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    error_log('Character API error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Impossible de charger les personnages.']);
}
