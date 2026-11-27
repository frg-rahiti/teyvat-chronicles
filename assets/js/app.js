(() => {
  const grid = document.querySelector('#character-grid');
  const searchInput = document.querySelector('#character-search');
  const filters = document.querySelector('#element-filters');
  const rarityFilter = document.querySelector('#rarity-filter');
  const count = document.querySelector('#character-count');
  const newsletter = document.querySelector('#newsletter-form');
  const newsletterMessage = document.querySelector('#newsletter-message');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const dialog = document.querySelector('#character-dialog');
  const dialogClose = dialog?.querySelector('.dialog-close');

  const fallbackCharacters = [
    {name:'Jean',title:'Chevalier de pissenlit',element:'Anémo',weapon:'Épée',rarity:5,region:'Mondstadt',description:'Grande Maîtresse par intérim, elle veille sur Mondstadt.'},
    {name:'Xiangling',title:'Cheffe cuisinière',element:'Pyro',weapon:'Lance',rarity:4,region:'Liyue',description:'Une cheffe passionnée qui n’a peur d’aucune expérience.'},
    {name:'Keqing',title:'Éclair de la nuit',element:'Électro',weapon:'Épée',rarity:5,region:'Liyue',description:'Une dirigeante déterminée qui croit au pouvoir de l’action.'},
    {name:'Ayaka',title:'Héron givré',element:'Cryo',weapon:'Épée',rarity:5,region:'Inazuma',description:'La fille du clan Kamisato, reconnue pour sa grâce.'},
    {name:'Collei',title:'Jeune pousse',element:'Dendro',weapon:'Arc',rarity:4,region:'Sumeru',description:'Une apprentie garde forestière qui avance avec courage.'},
    {name:'Neuvillette',title:'Ordonnateur suprême',element:'Hydro',weapon:'Catalyseur',rarity:5,region:'Fontaine',description:'Le juge en chef de Fontaine, gardien d’une justice rigoureuse.'}
  ];
  let allCharacters = [];
  let activeElement = 'all';
  let activeRarity = 'all';

  const elementClass = element => ({
    'Anémo':'anemo','Géo':'geo','Électro':'electro','Dendro':'dendro',
    'Hydro':'hydro','Pyro':'pyro','Cryo':'cryo'
  }[element] || 'neutral');

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
    }[char]));
  }

  function renderCharacters() {
    if (!grid) return;
    const query = (searchInput?.value || '').trim().toLocaleLowerCase('fr');
    const visible = allCharacters.filter(character => {
      const matchesElement = activeElement === 'all' || character.element === activeElement;
      const matchesRarity = activeRarity === 'all' || String(character.rarity) === activeRarity;
      const haystack = `${character.name} ${character.title} ${character.region} ${character.weapon} ${character.element}`.toLocaleLowerCase('fr');
      return matchesElement && matchesRarity && haystack.includes(query);
    });
    count.textContent = `${visible.length} personnage${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''} · ${allCharacters.length} au catalogue`;
    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state">Aucun personnage ne correspond à votre recherche.</div>';
      return;
    }
    grid.innerHTML = visible.map((c, index) => {
      const element = escapeHTML(c.element);
      const initials = escapeHTML(c.name.slice(0, 1));
      const image = c.card_url ? `<img src="${escapeHTML(c.card_url)}" alt="Illustration de ${escapeHTML(c.name)}" loading="lazy" onerror="this.classList.add('image-unavailable')">` : '';
      return `<button type="button" class="character-card ${elementClass(c.element)}" data-character-id="${escapeHTML(c.id || c.name)}" style="--card-index:${index}" aria-label="Ouvrir la fiche de ${escapeHTML(c.name)}">
        <div class="character-art">${image}<span class="character-initial">${initials}</span><span class="element-pill">${element}</span><span class="rarity">${'★'.repeat(Math.max(1, Math.min(5, Number(c.rarity) || 4)))}</span></div>
        <div class="character-info"><span>${escapeHTML(c.region)} · ${escapeHTML(c.weapon)}</span><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.title)}</p><div class="character-description">${escapeHTML(c.description)}</div><span class="card-more">Voir la fiche <b>↗</b></span></div>
      </button>`;
    }).join('');
  }

  function openCharacter(character) {
    if (!dialog || !character) return;
    const setText = (selector, value) => {
      const node = dialog.querySelector(selector);
      if (node) node.textContent = value || '';
    };
    setText('#dialog-name', character.name);
    setText('#dialog-title', character.title);
    setText('#dialog-vision', character.element);
    setText('#dialog-meta', `${character.region}  ·  ${character.weapon}  ·  ${character.rarity} ★`);
    setText('#dialog-description', character.description || 'Aucune description disponible pour le moment.');
    const splash = dialog.querySelector('#dialog-splash');
    const card = dialog.querySelector('#dialog-card');
    splash.src = character.splash_url || character.card_url || '';
    splash.alt = `Illustration complète de ${character.name}`;
    splash.onerror = () => { splash.style.display = 'none'; };
    splash.onload = () => { splash.style.display = ''; };
    card.src = character.card_url || character.splash_url || '';
    card.alt = `Carte illustrée de ${character.name}`;
    card.onerror = () => { card.style.display = 'none'; };
    card.onload = () => { card.style.display = ''; };
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  const IMAGE_API = 'https://genshin-api.deve.sh/characters?details=true';

  function normalizeCharacterKey(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Canonicalise les noms officiels et les noms courts utilisés par l'ancien catalogue MySQL.
  function canonicalCharacterName(value) {
    const key = normalizeCharacterKey(value);
    return key === 'kamisato-ayaka' ? 'ayaka'
      : key === 'kamisato-ayato' ? 'ayato'
      : key;
  }

  async function enrichWithExternalImages(characters) {
    try {
      const response = await fetch(IMAGE_API, {
        headers: {'Accept':'application/json'},
        cache: 'force-cache'
      });
      if (!response.ok) throw new Error(`API personnages HTTP ${response.status}`);

      const payload = await response.json();
      const remoteCharacters = Array.isArray(payload.characters)
        ? payload.characters
        : (Array.isArray(payload) ? payload : []);
      if (!remoteCharacters.length) throw new Error('La source externe ne retourne aucun personnage.');

      const elementLabels = {
        anemo:'Anémo', geo:'Géo', electro:'Électro', dendro:'Dendro',
        hydro:'Hydro', pyro:'Pyro', cryo:'Cryo'
      };
      const weaponLabels = {
        sword:'Épée', claymore:'Épée à deux mains', polearm:'Lance',
        catalyst:'Catalyseur', bow:'Arc'
      };
      const regionLabels = {
        mondstadt:'Mondstadt', liyue:'Liyue', inazuma:'Inazuma',
        sumeru:'Sumeru', fontaine:'Fontaine', natlan:'Natlan',
        snezhnaya:'Snezhnaya', nodkrai:'Nod-Krai',
        outlander:'Ailleurs', unknown:'Inconnu'
      };
      const localByName = new Map();
      characters.forEach(local => {
        const key = canonicalCharacterName(local.name);
        if (key) localByName.set(key, local);
      });

      const getTraveler = remote => {
        const key = normalizeCharacterKey(remote.key || remote.slug || '');
        const name = normalizeCharacterKey(remote.name || '');
        const match = key.match(/^(aether|lumine)(?:-|$)/) || name.match(/^(aether|lumine)(?:-|$)/);
        return match ? match[1] : '';
      };
      const getCanonicalKey = remote => {
        const traveler = getTraveler(remote);
        if (traveler) return `traveler-${traveler}`;
        return canonicalCharacterName(remote.name || remote.key || remote.slug);
      };

      // Regroupe les variantes élémentaires du Voyageur et déduplique les autres personnages par nom.
      const canonicalRemote = new Map();
      remoteCharacters.forEach(remote => {
        const canonicalKey = getCanonicalKey(remote);
        if (!canonicalKey) return;
        const existing = canonicalRemote.get(canonicalKey);
        const images = remote.img || remote.images || {};
        const existingImages = existing?.img || existing?.images || {};
        const hasImage = Boolean(images.card || images.portrait || images['icon-big'] || images.icon);
        const existingHasImage = Boolean(existingImages.card || existingImages.portrait || existingImages['icon-big'] || existingImages.icon);
        if (!existing || (hasImage && !existingHasImage)) canonicalRemote.set(canonicalKey, remote);
      });

      const completeRoster = [];
      canonicalRemote.forEach((remote, canonicalKey) => {
        const traveler = canonicalKey.startsWith('traveler-') ? canonicalKey.slice('traveler-'.length) : '';
        const local = traveler
          ? localByName.get(traveler === 'aether' ? 'aether' : 'lumine') || {}
          : localByName.get(canonicalCharacterName(remote.name || remote.key || remote.slug)) || {};
        const images = remote.img || remote.images || {};
        const vision = String(remote.vision || remote.element || local.element || '');
        const weapon = String(remote.weapon || remote.weapon_type || local.weapon || '');
        const nation = String(remote.nation || remote.region || local.region || '');
        const remoteKey = normalizeCharacterKey(remote.key || remote.slug || remote.name);
        const remoteName = normalizeCharacterKey(remote.name || '');
        // Ayaka et les Voyageurs de Miliastra : privilégier les fichiers icon-big,
        // les cartes card étant absentes ou parfois indisponibles dans la source.
        const needsImageFallback = ['ayaka', 'kamisato-ayaka', 'manekin', 'manekina'].includes(remoteKey)
          || remoteName.includes('ayaka');
        // Les cartes du catalogue affichent désormais l'illustration splash (banner/gacha-splash).
        // Les portraits restent en secours si la source ne possède pas de splash.
        const imageSplash = images.banner || images.splash || '';
        const imageCard = imageSplash || (needsImageFallback
          ? (images['icon-big'] || images.portrait || images.icon || images.card || '')
          : (images.card || images.portrait || images['icon-big'] || images.icon || ''));

        completeRoster.push({
          ...local,
          id: traveler ? (traveler === 'aether' ? 'aether' : 'lumine') : (remote.key || remote.slug || local.id || canonicalKey),
          slug: traveler ? (traveler === 'aether' ? 'aether' : 'lumine') : (remote.key || remote.slug || local.slug || canonicalKey),
          name: traveler ? (traveler === 'aether' ? 'Aether' : 'Lumine') : (remote.name || local.name || 'Personnage inconnu'),
          title: remote.title || local.title || (traveler ? 'Voyageur' : ''),
          element: elementLabels[vision.toLowerCase()] || vision || 'Inconnu',
          weapon: weaponLabels[weapon.toLowerCase()] || weapon || 'Inconnu',
          rarity: Number(remote.rarity || local.rarity || 4),
          region: regionLabels[nation.toLowerCase()] || nation || local.region || 'Inconnu',
          description: remote.description || local.description || '',
          card_url: imageCard || local.card_url || local.image_url || '',
          splash_url: imageSplash || local.splash_url || imageCard || local.card_url || ''
        });
      });

      // Si l'API ne fournit pas le Voyageur, conserve sa fiche locale plutôt que de créer des doublons.
      ['aether', 'lumine'].forEach(name => {
        const canonicalKey = `traveler-${name}`;
        if (!canonicalRemote.has(canonicalKey)) {
          const local = localByName.get(name);
          if (local) completeRoster.push({...local, id:name, slug:name});
        }
      });

      // Ajoute uniquement les fiches locales dont le nom n'existe pas déjà dans le catalogue distant.
      const seenNames = new Set(completeRoster.map(character => canonicalCharacterName(character.name)));
      characters.forEach(local => {
        const key = canonicalCharacterName(local.name);
        if (key && !seenNames.has(key)) {
          completeRoster.push(local);
          seenNames.add(key);
        }
      });

      return completeRoster.sort((a, b) =>
        Number(b.rarity || 0) - Number(a.rarity || 0) ||
        String(a.name).localeCompare(String(b.name), 'fr')
      );
    } catch (error) {
      console.warn('Teyvat Chronicles: catalogue externe indisponible, conservation du catalogue MySQL.', error);
      return characters;
    }
  }

  async function loadCharacters() {
    if (!grid) return;
    try {
      const response = await fetch('api/catalog.php', {
        headers: {'Accept':'application/json'},
        cache: 'no-store'
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !Array.isArray(data.characters)) {
        throw new Error(data.message || 'Catalogue local indisponible');
      }

      allCharacters = await enrichWithExternalImages(data.characters);
      count.textContent = `Catalogue MySQL · ${data.total || allCharacters.length} personnages`;
      renderCharacters();
    } catch (error) {
      console.error('Teyvat Chronicles catalog:', error);
      allCharacters = [];
      grid.innerHTML = '<div class="empty-state">Le catalogue est momentanément indisponible. Vérifiez la configuration de la base de données et la migration SQL.</div>';
      count.textContent = 'Catalogue MySQL indisponible';
    }
  }

  searchInput?.addEventListener('input', renderCharacters);
  filters?.addEventListener('click', event => {
    const button = event.target.closest('button[data-element]');
    if (!button) return;
    activeElement = button.dataset.element;
    filters.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
    renderCharacters();
  });
  rarityFilter?.addEventListener('change', () => {
    activeRarity = rarityFilter.value;
    renderCharacters();
  });
  grid?.addEventListener('click', event => {
    const card = event.target.closest('[data-character-id]');
    if (!card) return;
    const character = allCharacters.find(item => String(item.id || item.name) === card.dataset.characterId);
    openCharacter(character);
  });
  dialogClose?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog?.open) dialog.close();
  });

  newsletter?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = newsletter.querySelector('button');
    button.disabled = true;
    newsletterMessage.textContent = 'Inscription en cours…';
    try {
      const response = await fetch('api/subscribe.php', {method:'POST', body:new FormData(newsletter), headers:{'Accept':'application/json'}});
      const result = await response.json();
      newsletterMessage.textContent = result.message || 'Une erreur est survenue.';
      newsletterMessage.classList.toggle('success', Boolean(result.ok));
      if (result.ok) newsletter.reset();
    } catch {
      newsletterMessage.textContent = 'Impossible de contacter le serveur pour le moment.';
      newsletterMessage.classList.remove('success');
    } finally { button.disabled = false; }
  });

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open'); menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const revealSelector = '.home-intro, .home-outro, .page-hero, .section-heading, .guide-card, .region-card, .community-section, .community-page-section, .character-card, .destination-card';
  const observeReveals = root => {
    if (!root || !('IntersectionObserver' in window)) return;
    root.querySelectorAll(revealSelector).forEach((el, index) => {
      el.classList.add('motion-reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 90}ms`);
      revealObserver.observe(el);
    });
  };
  let revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    }), {threshold:0.12});
    observeReveals(document);
    if (grid) {
      const cardObserver = new MutationObserver(() => observeReveals(grid));
      cardObserver.observe(grid, {childList:true});
    }
  } else {
    document.querySelectorAll(revealSelector).forEach(el => el.classList.add('revealed'));
  }

  // Parallaxe multi-couches : chaque élément du décor se déplace à une vitesse différente.
  const hero = document.querySelector('.hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hero && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const layers = [
      {node: hero.querySelector('.hero-glass'), factor: 18},
      {node: hero.querySelector('.orbit-a'), factor: 30},
      {node: hero.querySelector('.orbit-b'), factor: -24},
      {node: hero.querySelector('.hero-sigil'), factor: 42},
      {node: hero.querySelector('.floating-note.note-top'), factor: 26},
      {node: hero.querySelector('.floating-note.note-bottom'), factor: -18},
      {node: hero.querySelector('.hero-caption'), factor: 12}
    ].filter(layer => layer.node);

    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
      layers.forEach(({node, factor}) => {
        const distance = factor / 2;
        node.style.translate = `${(x * distance).toFixed(1)}px ${(y * distance * .65).toFixed(1)}px`;
      });
      hero.style.setProperty('--hero-pointer-x', `${(event.clientX - rect.left).toFixed(0)}px`);
      hero.style.setProperty('--hero-pointer-y', `${(event.clientY - rect.top).toFixed(0)}px`);
    }, {passive:true});

    hero.addEventListener('pointerleave', () => {
      layers.forEach(({node}) => { node.style.translate = '0px 0px'; });
      hero.style.removeProperty('--hero-pointer-x');
      hero.style.removeProperty('--hero-pointer-y');
    }, {passive:true});
  }

  // Global navigation without scroll-linked style writes (better async scrolling in Firefox).
  const body = document.body;
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Retour en haut');
  backToTop.innerHTML = '<span>↑</span>';
  body.append(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior: reduceMotion ? 'auto' : 'smooth'}));

  const scrollSentinel = document.createElement('span');
  scrollSentinel.setAttribute('aria-hidden', 'true');
  scrollSentinel.style.cssText = 'position:absolute;top:520px;left:0;width:1px;height:1px;pointer-events:none;';
  body.prepend(scrollSentinel);
  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      backToTop.classList.toggle('is-visible', !entry.isIntersecting);
    });
    visibilityObserver.observe(scrollSentinel);
  }

  // Header state is observed instead of recalculated on every scroll frame.
  const header = document.querySelector('.site-header');
  const headerSentinel = document.createElement('span');
  headerSentinel.setAttribute('aria-hidden', 'true');
  headerSentinel.style.cssText = 'position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none;';
  body.prepend(headerSentinel);
  if (header && 'IntersectionObserver' in window) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    });
    headerObserver.observe(headerSentinel);
  }

  // Tiny ambient particles: CSS-only motion after this one-time DOM setup.
  const heroArt = document.querySelector('.hero-art');
  if (heroArt && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroArt.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroArt.style.setProperty('--hero-pointer-x', `${(x * 14).toFixed(2)}px`);
      heroArt.style.setProperty('--hero-pointer-y', `${(y * 14).toFixed(2)}px`);
    }, {passive:true});
    heroArt.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--hero-pointer-x', '0px');
      heroArt.style.setProperty('--hero-pointer-y', '0px');
    }, {passive:true});
  }
  if (heroArt && !heroArt.querySelector('.hero-particles')) {
    const particles = document.createElement('div');
    particles.className = 'hero-particles';
    particles.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 34; index += 1) {
      const particle = document.createElement('i');
      particle.style.setProperty('--particle-x', `${(index * 37 + 11) % 96}%`);
      particle.style.setProperty('--particle-y', `${(index * 53 + 7) % 90}%`);
      particle.style.setProperty('--particle-delay', `${(index % 8) * -0.7}s`);
      particle.style.setProperty('--particle-duration', `${5 + (index % 6)}s`);
      particles.append(particle);
    }
    heroArt.prepend(particles);
  }

  // Active navigation follows the section currently visible on screen.
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const observedSections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const current = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-25% 0px -60% 0px', threshold:[0,.15,.35,.6]});
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  // Soft pointer lighting and restrained 3D tilt for desktop cards.
  const attachCardMotion = root => {
    root.querySelectorAll('.character-card, .region-card, .guide-card, .destination-card').forEach(card => {
      if (card.dataset.motionReady) return;
      card.dataset.motionReady = 'true';
      card.addEventListener('pointermove', event => {
        if (reduceMotion || event.pointerType === 'touch' || !window.matchMedia('(hover: hover)').matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--pointer-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--pointer-y', `${(y * 100).toFixed(1)}%`);
        card.style.setProperty('--tilt-x', `${((x - .5) * 3.2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${((.5 - y) * 3.2).toFixed(2)}deg`);
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x','0deg');
        card.style.setProperty('--tilt-y','0deg');
      }, {passive:true});
    });
  };
  attachCardMotion(document);
  if (grid) {
    const motionObserver = new MutationObserver(() => attachCardMotion(grid));
    motionObserver.observe(grid, {childList:true});
  }

  // Filter feedback: make each result update feel intentional, not like a hard redraw.
  [searchInput, rarityFilter].filter(Boolean).forEach(control => {
    control.addEventListener('focus', () => control.closest('.search-box, .rarity-filter')?.classList.add('is-focused'));
    control.addEventListener('blur', () => control.closest('.search-box, .rarity-filter')?.classList.remove('is-focused'));
  });
  if (grid) loadCharacters();

  // Page transitions: same-origin navigation with a short exit motion.
  if (!reduceMotion) {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname && url.hash) return;
      if (!/^https?:$/.test(url.protocol)) return;
      event.preventDefault();
      document.documentElement.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = url.href; }, 300);
    });
  }

  // The reveal observer is initialized once and covers all page sections above.

  // Ambient cursor glow on immersive sections.
  document.querySelectorAll('.hero, .page-hero, .community-page-section, .home-outro').forEach(section => {
    section.addEventListener('pointermove', event => {
      if (reduceMotion || event.pointerType === 'touch') return;
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
      section.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
    }, {passive:true});
  });

  // Character detail modal receives a deliberate entrance/exit treatment.
  dialog?.addEventListener('close', () => dialog.classList.remove('dialog-open'));
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  // Small interaction cues for navigation and calls to action.
  document.querySelectorAll('.button, .header-cta, .destination-link').forEach(control => {
    control.addEventListener('pointerdown', () => {
      if (!reduceMotion) control.classList.add('is-pressed');
    });
    ['pointerup','pointerleave','blur'].forEach(type => control.addEventListener(type, () => control.classList.remove('is-pressed')));
  });

})();