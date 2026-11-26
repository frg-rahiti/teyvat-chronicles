<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/includes/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}
if (!$pdo) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'La base de données doit être configurée avant les inscriptions.']);
    exit;
}

$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if (!$email || strlen((string)$email) > 190) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Adresse e-mail invalide.']);
    exit;
}

try {
    $statement = $pdo->prepare('INSERT INTO newsletter_subscribers (email) VALUES (:email) ON DUPLICATE KEY UPDATE email = VALUES(email)');
    $statement->execute(['email' => $email]);
    echo json_encode(['ok' => true, 'message' => 'Bienvenue dans le carnet des voyageurs !']);
} catch (Throwable $exception) {
    error_log('Newsletter error: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Une erreur est survenue. Réessayez plus tard.']);
}
