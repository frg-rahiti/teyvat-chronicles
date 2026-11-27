<?php
$pageTitle = $pageTitle ?? 'Explorer Teyvat';
$activePage = $activePage ?? '';
?>
<header class="site-header">
  <a class="brand" href="index.php" aria-label="Teyvat Chronicles, accueil"><span class="brand-mark">✧</span><span><b>TEYVAT</b><small>CHRONICLES</small></span></a>
  <button class="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
  <nav class="main-nav" aria-label="Navigation principale">
    <a class="<?= $activePage === 'home' ? 'active' : '' ?>" href="index.php">Accueil</a>
    <a class="<?= $activePage === 'characters' ? 'active' : '' ?>" href="personnages.php">Personnages</a>
    <a class="<?= $activePage === 'regions' ? 'active' : '' ?>" href="regions.php">Régions</a>
    <a class="<?= $activePage === 'guides' ? 'active' : '' ?>" href="guides.php">Guides</a>
    <a class="<?= $activePage === 'community' ? 'active' : '' ?>" href="communaute.php">Communauté</a>
  </nav>
  <a class="header-cta" href="personnages.php">Explorer Teyvat <span>↗</span></a>
</header>