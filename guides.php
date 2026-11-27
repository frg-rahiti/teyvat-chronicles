<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Guides';
$activePage = 'guides';
?>
<!doctype html><html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101722"><meta name="description" content="Guides — Teyvat Chronicles, votre encyclopédie de Genshin Impact.">
<title>Guides — TEYVAT CHRONICLES</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=9"></head><body class="inner-page">
<?php require __DIR__ . '/includes/site-header.php'; ?>
<main><section class="page-hero"><div class="eyebrow"><i></i> Notes d'exploration</div><h1>Préparez votre <em>aventure.</em></h1><p>Des conseils pour mieux composer vos équipes, progresser et profiter pleinement de votre voyage.</p><div class="page-hero-meta">BIBLIOTHÈQUE DES GUIDES</div></section>
<section class="section guides-page-section"><div class="guide-grid">
<article class="guide-card"><div class="guide-icon">✦</div><span>PREMIERS PAS</span><h3>Construire une équipe équilibrée</h3><p>Apprenez à combiner les rôles, les éléments et les réactions pour créer une équipe cohérente.</p><a href="personnages.php">Découvrir les personnages <b>↗</b></a></article>
<article class="guide-card"><div class="guide-icon">⌖</div><span>EXPLORATION</span><h3>Ne négligez pas votre carte</h3><p>Marquez les ressources, repérez les énigmes et revenez sur les zones que vous n'avez pas terminées.</p><a href="regions.php">Explorer les régions <b>↗</b></a></article>
<article class="guide-card"><div class="guide-icon">◈</div><span>PROGRESSION</span><h3>Investir intelligemment</h3><p>Concentrez vos ressources sur quelques personnages avant d'élargir votre équipe.</p><a href="personnages.php">Voir le catalogue <b>↗</b></a></article>
</div><p class="content-note">Les guides détaillés seront ajoutés progressivement. Cette page est désormais indépendante de l'accueil.</p></section></main>
<?php require __DIR__ . '/includes/site-footer.php'; ?>
</body></html>