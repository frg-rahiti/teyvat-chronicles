<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Accueil';
$activePage = 'home';
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101722">
<meta name="description" content="Explorez Teyvat : découvrez les personnages, les régions et les guides de Genshin Impact.">
<title>TEYVAT CHRONICLES — L'encyclopédie des voyageurs</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=15">
</head>
<body class="home-page">
<div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
<?php require __DIR__ . '/includes/site-header.php'; ?>
<main>
<section class="hero home-hero">
 <div class="hero-copy">
  <div class="eyebrow"><i></i> L'encyclopédie des voyageurs</div>
  <h1>Un monde.<br><em>Sept nations.</em><br>Des aventures infinies.</h1>
  <p>Entrez dans Teyvat et partez à la rencontre de ses héros, de ses contrées et de ses mystères.</p>
  <div class="hero-actions"><a class="button button-primary" href="personnages.php">Commencer l'exploration <span>→</span></a><a class="text-link" href="regions.php">Découvrir les régions <span>↗</span></a></div>
  <div class="hero-footnote"><span class="star">✦</span> Votre carnet de voyage commence ici.</div>
 </div>
 <div class="hero-art" aria-label="Emblème céleste de Teyvat">
  <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="hero-sigil">✧</div><div class="hero-glass"></div>
  <div class="hero-caption"><span>TEYVAT · 7 NATIONS</span><b>LE VOYAGE NE FAIT QUE COMMENCER</b></div>
  <div class="floating-note note-top">✦ &nbsp; Teyvat vous attend</div><div class="floating-note note-bottom">ANEMO · GEO · PYRO · HYDRO</div>
 </div>
 <div class="hero-scroll"><span></span> DÉCOUVRIR LE MONDE</div>
</section>
<section class="home-intro section">
 <div class="eyebrow"><i></i> Votre aventure commence ici</div>
 <h2>Tout Teyvat, <em>à portée de main.</em></h2>
 <p>Retrouvez l'essentiel de Genshin Impact dans un espace pensé pour explorer simplement. Choisissez votre destination et plongez dans le contenu qui vous intéresse.</p>
</section>
<section class="home-destinations section">
 <a class="destination-card destination-characters" href="personnages.php"><span class="destination-index">01 / COLLECTION</span><div><span class="eyebrow">Le carnet du voyageur</span><h2>Personnages</h2><p>Découvrez les héros, leurs visions, leurs armes et leurs histoires.</p><span class="destination-link">Voir les personnages <b>↗</b></span></div><span class="destination-mark">✦</span></a>
 <a class="destination-card destination-regions" href="regions.php"><span class="destination-index">02 / EXPLORATION</span><div><span class="eyebrow">Au-delà de l'horizon</span><h2>Régions</h2><p>Parcourez les nations et découvrez les cultures de Teyvat.</p><span class="destination-link">Explorer les régions <b>↗</b></span></div><span class="destination-mark">⌖</span></a>
 <a class="destination-card destination-guides" href="guides.php"><span class="destination-index">03 / CONSEILS</span><div><span class="eyebrow">Notes d'exploration</span><h2>Guides</h2><p>Préparez vos équipes, optimisez votre progression et explorez mieux.</p><span class="destination-link">Lire les guides <b>↗</b></span></div><span class="destination-mark">◈</span></a>
 <a class="destination-card destination-community" href="communaute.php"><span class="destination-index">04 / RENCONTRES</span><div><span class="eyebrow">Le courrier des voyageurs</span><h2>Communauté</h2><p>Suivez les nouveautés et partagez votre passion pour Teyvat.</p><span class="destination-link">Rejoindre la communauté <b>↗</b></span></div><span class="destination-mark">✧</span></a>
</section>
<section class="home-outro"><div class="eyebrow"><i></i> Le monde vous attend</div><h2>Prêt à écrire<br><em>votre légende ?</em></h2><a class="button button-primary" href="personnages.php">Explorer Teyvat <span>→</span></a></section>
</main>
<?php require __DIR__ . '/includes/site-footer.php'; ?>
</body></html>