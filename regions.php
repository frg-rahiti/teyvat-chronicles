<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Régions';
$activePage = 'regions';
?>
<!doctype html><html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101722"><meta name="description" content="Régions — Teyvat Chronicles, votre encyclopédie de Genshin Impact.">
<title>Régions — TEYVAT CHRONICLES</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=10"></head><body class="inner-page">
<?php require __DIR__ . '/includes/site-header.php'; ?>
<main><section class="page-hero"><div class="eyebrow"><i></i> Au-delà de l'horizon</div><h1>Sept nations, <em>sept destins.</em></h1><p>Chaque région possède sa culture, son élément et sa vision du monde. Où votre voyage vous mènera-t-il ?</p><div class="page-hero-meta">ATLAS DE TEYVAT · 7 NATIONS</div></section>
<section class="section regions-page-section"><div class="region-grid">
<article class="region-card mondstadt"><div class="region-number">01</div><div class="region-content"><span>LIBERTÉ · ANÉMO</span><h3>Mondstadt</h3><p>La cité de la liberté, bercée par les vents.</p></div><span class="region-symbol">風</span></article>
<article class="region-card liyue"><div class="region-number">02</div><div class="region-content"><span>CONTRATS · GÉO</span><h3>Liyue</h3><p>Le port où les montagnes rencontrent la mer.</p></div><span class="region-symbol">岩</span></article>
<article class="region-card inazuma"><div class="region-number">03</div><div class="region-content"><span>ÉTERNITÉ · ÉLECTRO</span><h3>Inazuma</h3><p>Un archipel façonné par la foudre.</p></div><span class="region-symbol">雷</span></article>
<article class="region-card sumeru"><div class="region-number">04</div><div class="region-content"><span>SAGESSE · DENDRO</span><h3>Sumeru</h3><p>Entre forêt luxuriante et désert ancien.</p></div><span class="region-symbol">草</span></article>
<article class="region-card fontaine"><div class="region-number">05</div><div class="region-content"><span>JUSTICE · HYDRO</span><h3>Fontaine</h3><p>Le théâtre des lois, des eaux et des récits.</p></div><span class="region-symbol">水</span></article>
<article class="region-card natlan"><div class="region-number">06</div><div class="region-content"><span>GUERRE · PYRO</span><h3>Natlan</h3><p>Une terre ardente où résonne l'esprit combatif.</p></div><span class="region-symbol">炎</span></article>
<article class="region-card snezhnaya"><div class="region-number">07</div><div class="region-content"><span>INCONNU · CRYO</span><h3>Snezhnaya</h3><p>Une nation mystérieuse enveloppée de glace.</p></div><span class="region-symbol">氷</span></article>
</div></section></main>
<?php require __DIR__ . '/includes/site-footer.php'; ?>
</body></html>