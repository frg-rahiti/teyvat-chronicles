<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$pageTitle = 'Personnages';
$activePage = 'characters';
?>
<!doctype html><html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#101722"><meta name="description" content="Personnages — Teyvat Chronicles, votre encyclopédie de Genshin Impact.">
<title>Personnages — TEYVAT CHRONICLES</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css?v=10"></head><body class="inner-page">
<?php require __DIR__ . '/includes/site-header.php'; ?>
<main><section class="page-hero"><div class="eyebrow"><i></i> Le carnet du voyageur</div><h1>Rencontrez les <em>héros.</em></h1><p>Parcourez le catalogue, trouvez votre prochain compagnon et découvrez son histoire.</p><div class="page-hero-meta">CATALOGUE DES PERSONNAGES · TEYVAT</div></section>
<section class="section characters-section standalone-catalog">
 <div class="character-toolbar">
  <label class="search-box"><span>⌕</span><input id="character-search" type="search" placeholder="Rechercher un personnage..." autocomplete="off"></label>
  <div class="catalog-controls">
   <div class="filter-group" id="element-filters" aria-label="Filtrer par élément">
    <button class="filter active" data-element="all">Tous</button><button class="filter" data-element="Anémo">Anémo</button><button class="filter" data-element="Géo">Géo</button><button class="filter" data-element="Électro">Électro</button><button class="filter" data-element="Dendro">Dendro</button><button class="filter" data-element="Hydro">Hydro</button><button class="filter" data-element="Pyro">Pyro</button><button class="filter" data-element="Cryo">Cryo</button>
   </div><label class="rarity-filter"><span>Rareté</span><select id="rarity-filter"><option value="all">Toutes</option><option value="5">5 étoiles</option><option value="4">4 étoiles</option></select></label>
  </div>
 </div>
 <div class="character-grid" id="character-grid"><div class="loading-state"><span class="loader"></span> Chargement des voyageurs…</div></div>
 <div class="section-bottom"><span id="character-count">Chargement du catalogue…</span><span class="small-note">Sélectionnez une carte pour ouvrir la fiche complète</span></div>
 <dialog class="character-dialog" id="character-dialog" aria-labelledby="dialog-name">
  <button class="dialog-close" type="button" aria-label="Fermer la fiche">×</button><div class="dialog-visual"><img id="dialog-splash" alt=""><div class="dialog-visual-shade"></div><div class="dialog-visual-label" id="dialog-vision"></div></div>
  <div class="dialog-content"><div class="eyebrow"><i></i> Dossier du voyageur</div><h3 id="dialog-name"></h3><p class="dialog-title" id="dialog-title"></p><div class="dialog-meta" id="dialog-meta"></div><p class="dialog-description" id="dialog-description"></p><div class="dialog-card-art"><img id="dialog-card" alt="Illustration de carte"></div></div>
 </dialog>
</section></main>
<?php require __DIR__ . '/includes/site-footer.php'; ?>
</body></html>