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

  function normalizeRemoteCharacters(payload) {
    const records = payload?.characters || payload?.data || payload;
    if (!records || typeof records !== 'object') return [];
    const entries = Array.isArray(records)
      ? records.map((item, index) => [String(index), item])
      : Object.entries(records);
    const labels = {
      anemo:'Anémo', geo:'Géo', electro:'Électro', dendro:'Dendro',
      hydro:'Hydro', pyro:'Pyro', cryo:'Cryo',
      sword:'Épée', claymore:'Épée à deux mains', polearm:'Lance',
      catalyst:'Catalyseur', bow:'Arc'
    };
    return entries.flatMap(([key, item]) => {
      if (!item || typeof item !== 'object') return [];
      const name = item.name || item.Name || item.displayName || key;
      if (!name) return [];
      const slug = String(item.id || item.key || item.slug || key || name)
        .toLowerCase().trim().replace(/[ _]+/g, '-').replace(/[^a-z0-9-]/g, '');
      const elementRaw = item.vision || item.element || item.Vision || item.Element || 'Inconnu';
      const weaponRaw = item.weapon || item.weaponType || item.Weapon || 'Inconnue';
      const rarity = Number(item.rarity || item.Rarity) || 4;
      return [{
        id: slug,
        name,
        title: item.title || item.Title || 'Voyageur de Teyvat',
        element: labels[String(elementRaw).toLowerCase()] || elementRaw,
        weapon: labels[String(weaponRaw).toLowerCase()] || weaponRaw,
        rarity: rarity >= 1 && rarity <= 5 ? rarity : 4,
        region: item.nation || item.region || item.Nation || 'Inconnue',
        description: item.description || item.Description || 'Découvrez son histoire et ses talents dans Teyvat.',
        card_url: `https://genshin.jmp.blue/characters/${encodeURIComponent(slug)}/card`,
        splash_url: `https://genshin.jmp.blue/characters/${encodeURIComponent(slug)}/gacha-splash`
      }];
    }).sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name, 'fr'));
  }

  async function loadCharacters() {
    // First try from the visitor's browser: this avoids OVH's outbound
    // server connection, which is currently failing on this hosting plan.
    try {
      const response = await fetch('https://genshin.jmp.blue/characters/all?lang=fr', {
        headers: {'Accept':'application/json'},
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`API HTTP ${response.status}`);
      const payload = await response.json();
      const remoteCharacters = normalizeRemoteCharacters(payload);
      if (!remoteCharacters.length) throw new Error('Aucun personnage reçu');
      allCharacters = remoteCharacters;
      count.textContent = `Catalogue en ligne · ${allCharacters.length} personnages`;
    } catch (browserApiError) {
      // Compatibility fallback: keep the PHP proxy and then the local DB.
      try {
        const response = await fetch('api/catalog.php', {headers:{'Accept':'application/json'}});
        const data = await response.json();
        if (!response.ok || !data.ok || !Array.isArray(data.characters) || !data.characters.length) {
          throw new Error('Proxy indisponible');
        }
        allCharacters = data.characters;
        count.textContent = `Catalogue serveur · ${data.total || allCharacters.length} personnages`;
      } catch {
        try {
          const response = await fetch('api/characters.php', {headers:{'Accept':'application/json'}});
          const data = await response.json();
          if (!response.ok || !data.ok || !Array.isArray(data.characters)) throw new Error('Base locale indisponible');
          allCharacters = data.characters;
          count.textContent = 'Catalogue local de secours';
        } catch {
          allCharacters = fallbackCharacters;
          count.textContent = 'Aperçu de démonstration · sources indisponibles';
        }
      }
    }
    renderCharacters();
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

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
  }), {threshold:0.12});
  const observeReveals = root => {
    root.querySelectorAll('.section-heading, .guide-card, .region-card, .community-section, .character-card')
      .forEach(el => revealObserver.observe(el));
  };
  observeReveals(document);
  if (grid) {
    const cardObserver = new MutationObserver(() => observeReveals(grid));
    cardObserver.observe(grid, {childList:true});
  }

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive:true});
  loadCharacters();
})();