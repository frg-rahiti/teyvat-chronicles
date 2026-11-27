<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Communauté';
$activePage = 'community';
?>
<!doctype html><html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101722"><meta name="description" content="Communauté — Teyvat Chronicles, votre encyclopédie de Genshin Impact.">
<title>Communauté — TEYVAT CHRONICLES</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=11"></head><body class="inner-page">
<?php require __DIR__ . '/includes/site-header.php'; ?>
<main><section class="page-hero"><div class="eyebrow"><i></i> Le courrier des voyageurs</div><h1>La communauté <em>de Teyvat.</em></h1><p>Retrouvez les nouveautés du carnet et restez informé des prochaines explorations.</p><div class="page-hero-meta">RENCONTRES · ACTUALITÉS · PARTAGE</div></section>
<section class="community-page-section"><div class="community-orb">✧</div><div class="eyebrow"><i></i> Les nouvelles du voyage</div><h2>Une nouvelle aventure<br><em>à chaque visite.</em></h2><p>Recevez les nouveaux guides et les mises à jour du carnet de Teyvat.</p>
<form class="newsletter-form" id="newsletter-form"><label class="sr-only" for="newsletter-email">Votre adresse e-mail</label><input type="email" id="newsletter-email" name="email" placeholder="Votre adresse e-mail" required><button type="submit">S'inscrire <span>→</span></button></form><div class="newsletter-message" id="newsletter-message" role="status"></div><small>Pas de spam. Désinscription possible à tout moment.</small></section></main>
<?php require __DIR__ . '/includes/site-footer.php'; ?>
</body></html>