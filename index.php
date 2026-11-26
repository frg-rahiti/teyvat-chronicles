<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/bootstrap.php';
$siteName = 'TEYVAT CHRONICLES';
?>
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101722">
  <meta name="description" content="Explorez Teyvat : personnages, régions, guides et actualités de Genshin Impact.">
  <title><?= e($siteName) ?> — L'encyclopédie de Teyvat</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Marcellus&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css?v=4">
</head>
<body>
  <div class="ambient ambient-one"></div><div class="ambient ambient-two"></div>
  <header class="site-header">
    <a class="brand" href="#home" aria-label="Teyvat Chronicles, accueil">
      <span class="brand-mark">✧</span><span><b>TEYVAT</b><small>CHRONICLES</small></span>
    </a>
    <button class="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
    <nav class="main-nav">
      <a class="active" href="#home">Accueil</a><a href="#characters">Personnages</a>
      <a href="#regions">Régions</a><a href="#guides">Guides</a>
      <a href="#community">Communauté</a>
    </nav>
    <a class="header-cta" href="#characters">Explorer Teyvat <span>↗</span></a>
  </header>

  <main>
    <section class="hero" id="home">
      <div class="hero-copy">
        <div class="eyebrow"><i></i> L'encyclopédie des voyageurs</div>
        <h1>Un monde.<br><em>Sept nations.</em><br>Des aventures infinies.</h1>
        <p>Partez à la découverte de Teyvat. Retrouvez les héros, les régions et les secrets qui font la richesse de Genshin Impact.</p>
        <div class="hero-actions"><a class="button button-primary" href="#characters">Découvrir les personnages <span>→</span></a><a class="text-link" href="#regions">Explorer les régions <span>↗</span></a></div>
        <div class="hero-footnote"><span class="star">✦</span> Votre carnet de voyage commence ici.</div>
      </div>
      <div class="hero-art" aria-label="Illustration abstraite évoquant un paysage fantastique">
        <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div>
        <div class="hero-sigil">✧</div><div class="hero-glass"></div>
        <div class="hero-caption"><span>01 / 07</span><b>LE VOYAGE NE FAIT QUE COMMENCER</b></div>
        <div class="floating-note note-top">✦ &nbsp; Teyvat vous attend</div><div class="floating-note note-bottom">ANEMO · GEO · PYRO · HYDRO</div>
      </div>
      <div class="hero-scroll"><span></span> DÉFILER POUR EXPLORER</div>
    </section>

    <section class="ticker" aria-label="Les éléments"><div>ANEMO <b>✧</b> GEO <b>✧</b> ELECTRO <b>✧</b> DENDRO <b>✧</b> HYDRO <b>✧</b> PYRO <b>✧</b> CRYO <b>✧</b> ANEMO <b>✧</b> GEO <b>✧</b> ELECTRO <b>✧</b></div></section>

    <section class="section characters-section" id="characters">
      <div class="section-heading">
        <div><div class="eyebrow"><i></i> Le carnet du voyageur</div><h2>Rencontrez les <em>héros.</em></h2></div>
        <p>Des combattants aux histoires uniques, liés par leurs visions et leurs ambitions.</p>
      </div>
      <div class="character-toolbar">
        <label class="search-box"><span>⌕</span><input id="character-search" type="search" placeholder="Rechercher un personnage..." autocomplete="off"></label>
        <div class="catalog-controls">
          <div class="filter-group" id="element-filters" aria-label="Filtrer par élément">
            <button class="filter active" data-element="all">Tous</button><button class="filter" data-element="Anémo">Anémo</button><button class="filter" data-element="Géo">Géo</button><button class="filter" data-element="Électro">Électro</button><button class="filter" data-element="Dendro">Dendro</button><button class="filter" data-element="Hydro">Hydro</button><button class="filter" data-element="Pyro">Pyro</button><button class="filter" data-element="Cryo">Cryo</button>
          </div>
          <label class="rarity-filter"><span>Rareté</span><select id="rarity-filter"><option value="all">Toutes</option><option value="5">5 étoiles</option><option value="4">4 étoiles</option></select></label>
        </div>
      </div>
      <div class="character-grid" id="character-grid">
        <div class="loading-state"><span class="loader"></span> Chargement des voyageurs…</div>
      </div>
      <div class="section-bottom"><span id="character-count">Chargement du catalogue…</span><span class="small-note">Cliquez sur une carte pour ouvrir la fiche complète</span></div>
      <dialog class="character-dialog" id="character-dialog" aria-labelledby="dialog-name">
        <button class="dialog-close" type="button" aria-label="Fermer la fiche">×</button>
        <div class="dialog-visual"><img id="dialog-splash" alt=""><div class="dialog-visual-shade"></div><div class="dialog-visual-label" id="dialog-vision"></div></div>
        <div class="dialog-content"><div class="eyebrow"><i></i> Dossier du voyageur</div><h3 id="dialog-name"></h3><p class="dialog-title" id="dialog-title"></p><div class="dialog-meta" id="dialog-meta"></div><p class="dialog-description" id="dialog-description"></p><div class="dialog-card-art"><img id="dialog-card" alt="Illustration de carte"></div></div>
      </dialog>
    </section>

    <section class="regions-section" id="regions">
      <div class="section-heading light-heading">
        <div><div class="eyebrow"><i></i> Au-delà de l'horizon</div><h2>Sept nations, <em>sept destins.</em></h2></div>
        <p>Chaque région possède sa culture, son élément et sa vision du monde.</p>
      </div>
      <div class="region-grid">
        <article class="region-card mondstadt"><div class="region-number">01</div><div class="region-content"><span>LIBERTÉ · ANÉMO</span><h3>Mondstadt</h3><p>La cité de la liberté, bercée par les vents.</p></div><span class="region-symbol">風</span></article>
        <article class="region-card liyue"><div class="region-number">02</div><div class="region-content"><span>CONTRATS · GÉO</span><h3>Liyue</h3><p>Le port où les montagnes rencontrent la mer.</p></div><span class="region-symbol">岩</span></article>
        <article class="region-card inazuma"><div class="region-number">03</div><div class="region-content"><span>ÉTERNITÉ · ÉLECTRO</span><h3>Inazuma</h3><p>Un archipel façonné par la foudre.</p></div><span class="region-symbol">雷</span></article>
        <article class="region-card sumeru"><div class="region-number">04</div><div class="region-content"><span>SAGESSE · DENDRO</span><h3>Sumeru</h3><p>Entre forêt luxuriante et désert ancien.</p></div><span class="region-symbol">草</span></article>
        <article class="region-card fontaine"><div class="region-number">05</div><div class="region-content"><span>JUSTICE · HYDRO</span><h3>Fontaine</h3><p>Le théâtre des lois, des eaux et des récits.</p></div><span class="region-symbol">水</span></article>
        <article class="region-card natlan"><div class="region-number">06</div><div class="region-content"><span>GUERRE · PYRO</span><h3>Natlan</h3><p>Une terre ardente où résonne l'esprit combatif.</p></div><span class="region-symbol">炎</span></article>
        <article class="region-card snezhnaya"><div class="region-number">07</div><div class="region-content"><span>INCONNU · CRYO</span><h3>Snezhnaya</h3><p>Une nation mystérieuse enveloppée de glace.</p></div><span class="region-symbol">氷</span></article>
      </div>
    </section>

    <section class="guides-section" id="guides">
      <div class="section-heading">
        <div><div class="eyebrow"><i></i> Notes d'exploration</div><h2>Préparez votre <em>aventure.</em></h2></div>
        <p>Quelques repères pour progresser et profiter pleinement de votre voyage.</p>
      </div>
      <div class="guide-grid">
        <article class="guide-card"><div class="guide-icon">✦</div><span>PREMIERS PAS</span><h3>Construire une équipe équilibrée</h3><p>Apprenez à combiner les rôles, les éléments et les réactions pour créer une équipe cohérente.</p><a href="#community">Lire le conseil <b>↗</b></a></article>
        <article class="guide-card"><div class="guide-icon">⌖</div><span>EXPLORATION</span><h3>Ne négligez pas votre carte</h3><p>Marquez les ressources, repérez les énigmes et revenez sur les zones que vous n'avez pas terminées.</p><a href="#community">Lire le conseil <b>↗</b></a></article>
        <article class="guide-card"><div class="guide-icon">◈</div><span>PROGRESSION</span><h3>Investir intelligemment</h3><p>Concentrez vos ressources sur quelques personnages avant d'élargir votre équipe.</p><a href="#community">Lire le conseil <b>↗</b></a></article>
      </div>
    </section>

    <section class="community-section" id="community">
      <div class="community-orb">✧</div><div class="eyebrow"><i></i> Le courrier des voyageurs</div>
      <h2>Une nouvelle aventure<br><em>à chaque visite.</em></h2>
      <p>Recevez les nouveaux guides et les mises à jour du carnet de Teyvat.</p>
      <form class="newsletter-form" id="newsletter-form"><label class="sr-only" for="newsletter-email">Votre adresse e-mail</label><input type="email" id="newsletter-email" name="email" placeholder="Votre adresse e-mail" required><button type="submit">S'inscrire <span>→</span></button></form>
      <div class="newsletter-message" id="newsletter-message" role="status"></div>
      <small>Pas de spam. Désinscription possible à tout moment.</small>
    </section>
  </main>

  <footer class="site-footer"><a class="brand" href="#home"><span class="brand-mark">✧</span><span><b>TEYVAT</b><small>CHRONICLES</small></span></a><p>Un carnet de voyage créé par des fans, pour les fans.</p><div class="footer-bottom"><span>© <?= date('Y') ?> Teyvat Chronicles</span><span>Projet fan-made non officiel · Genshin Impact appartient à HoYoverse.</span><a href="#home">Retour en haut ↑</a></div></footer>

  <script src="assets/js/app.js?v=9" defer></script>
</body>
</html>
