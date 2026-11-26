<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=900');

const CATALOG_URL = 'https://genshin.jmp.blue/characters/all?lang=fr';
const CATALOG_CACHE_TTL = 43200;

function catalog_fetch(string $url): ?string {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 18,
            CURLOPT_USERAGENT => 'TeyvatChronicles/1.0 (fan encyclopedia)',
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($status >= 200 && $status < 300 && is_string($body)) ? $body : null;
    }

    $context = stream_context_create(['http' => [
        'timeout' => 18,
        'header' => "User-Agent: TeyvatChronicles/1.0\r\nAccept: application/json\r\n",
    ]]);
    $body = @file_get_contents($url, false, $context);
    return is_string($body) ? $body : null;
}

function slugify_character(string $value): string {
    $value = strtolower(trim($value));
    $value = str_replace([' ', '_'], '-', $value);
    return preg_replace('/[^a-z0-9-]/', '', $value) ?: '';
}

function first_value(array $data, array $keys, string $default = ''): string {
    foreach ($keys as $key) {
        if (isset($data[$key]) && (is_string($data[$key]) || is_numeric($data[$key]))) {
            $value = trim((string) $data[$key]);
            if ($value !== '') return $value;
        }
    }
    return $default;
}

function normalize_element(string $element): string {
    $map = [
        'anemo' => 'Anémo', 'geo' => 'Géo', 'electro' => 'Électro',
        'dendro' => 'Dendro', 'hydro' => 'Hydro', 'pyro' => 'Pyro',
        'cryo' => 'Cryo',
    ];
    return $map[strtolower($element)] ?? $element;
}

function normalize_weapon(string $weapon): string {
    $map = [
        'sword' => 'Épée', 'claymore' => 'Épée à deux mains',
        'polearm' => 'Lance', 'catalyst' => 'Catalyseur', 'bow' => 'Arc',
    ];
    return $map[strtolower($weapon)] ?? $weapon;
}

$cacheFile = sys_get_temp_dir() . '/teyvat-chronicles-catalog-fr.json';
$payload = null;
if (is_file($cacheFile) && (time() - (int) filemtime($cacheFile)) < CATALOG_CACHE_TTL) {
    $cached = file_get_contents($cacheFile);
    if (is_string($cached) && $cached !== '') $payload = $cached;
}

if ($payload === null) {
    $payload = catalog_fetch(CATALOG_URL);
    if ($payload === null) {
        $payload = catalog_fetch('https://genshin.jmp.blue/characters/all?lang=en');
    }
    if ($payload !== null) {
        @file_put_contents($cacheFile, $payload, LOCK_EX);
    }
}

if ($payload === null) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'Le catalogue distant est temporairement indisponible.']);
    exit;
}

$decoded = json_decode($payload, true);
if (!is_array($decoded)) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'message' => 'La source du catalogue a renvoyé des données invalides.']);
    exit;
}

$records = $decoded['characters'] ?? $decoded['data'] ?? $decoded;
$characters = [];
foreach ($records as $key => $record) {
    if (!is_array($record)) continue;
    $name = first_value($record, ['name', 'Name', 'displayName'], is_string($key) ? $key : '');
    if ($name === '') continue;

    $slug = first_value($record, ['id', 'key', 'slug'], is_string($key) ? $key : slugify_character($name));
    $slug = slugify_character($slug);
    if ($slug === '') $slug = slugify_character($name);

    $element = first_value($record, ['vision', 'element', 'Vision', 'Element'], 'Inconnu');
    $weapon = first_value($record, ['weapon', 'weaponType', 'Weapon'], 'Inconnue');
    $region = first_value($record, ['nation', 'region', 'Nation'], 'Inconnue');
    $rarity = (int) ($record['rarity'] ?? $record['Rarity'] ?? 0);
    if ($rarity < 1 || $rarity > 5) $rarity = 4;

    $characters[] = [
        'id' => $slug,
        'name' => $name,
        'title' => first_value($record, ['title', 'Title'], 'Voyageur de Teyvat'),
        'element' => normalize_element($element),
        'weapon' => normalize_weapon($weapon),
        'rarity' => $rarity,
        'region' => $region,
        'description' => first_value($record, ['description', 'Description'], 'Découvrez son histoire et ses talents dans Teyvat.'),
        'card_url' => 'https://genshin.jmp.blue/characters/' . rawurlencode($slug) . '/card',
        'splash_url' => 'https://genshin.jmp.blue/characters/' . rawurlencode($slug) . '/gacha-splash',
    ];
}

usort($characters, static function (array $a, array $b): int {
    return ($b['rarity'] <=> $a['rarity']) ?: strcasecmp($a['name'], $b['name']);
});

echo json_encode([
    'ok' => true,
    'source' => 'genshin.jmp.blue',
    'updated_at' => gmdate('c'),
    'total' => count($characters),
    'characters' => $characters,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
