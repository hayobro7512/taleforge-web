// Results page: streams POST /api/search?stream=1 (contract in API.md) and renders events as they arrive.

// Pure helpers; tests/test_server.py loads them through node.
const Taleforge = (() => {
  const DEFAULT_BALANCE = 62; // Lore share of Lore+Synergy; 62 ~ the ranker's default 50:30
  const FILTER_DELAY = 1500; // ms after the last filter edit before the search reruns
  const GUILDS = /\b(azorius|dimir|rakdos|gruul|selesnya|orzhov|izzet|golgari|boros|simic)\b/i;
  const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'vs', 'with']);
  const pct = (p, k) => {
    const v = p.has(k) && p.get(k) !== '' ? Number(p.get(k)) : NaN;
    return v >= 0 && v <= 100 ? v : NaN;
  };
  return {
    DEFAULT_BALANCE,
    FILTER_DELAY,
    // Runs fn once, ms after the last call; cancel() drops a pending run.
    debounce(fn, ms) {
      let t;
      const run = () => { clearTimeout(t); t = setTimeout(fn, ms); };
      run.cancel = () => clearTimeout(t);
      return run;
    },
    // ?balance=, else an old ?story=&synergy=&similarity= URL (story / (story + synergy)), else the default.
    balanceFromParams(p) {
      const b = pct(p, 'balance');
      if (!isNaN(b)) return Math.round(b);
      const story = pct(p, 'story'), synergy = pct(p, 'synergy');
      // floor so the old default 50:30 (62.5) lands on 62, the new default
      return story + synergy > 0 ? Math.floor(100 * story / (story + synergy)) : DEFAULT_BALANCE;
    },
    weights: (balance) => ({ story: balance / 100, synergy: (100 - balance) / 100, similarity: 0.2 }),
    // The slider has Lore on the left, so its input value is the Synergy share: the thumb leans to the bigger share.
    inputFromBalance: (balance) => 100 - balance,
    balanceFromInput: (value) => 100 - Number(value),
    // The mechanics heads-up shows for Play style/Keyword ideas with no Character, Guild or Story to anchor them.
    // The API has no guild field, so guilds are spotted by name in the idea or the chips.
    showMechanicNote(chips, query) {
      const mechanic = chips.some((c) => /^(Play style|Keyword):/.test(c));
      const anchored = chips.some((c) => /^(Character|Story):/.test(c)) || GUILDS.test(query + ' ' + chips.join(' '));
      return mechanic && !anchored;
    },
    // Tags come from the API's evidence list: "lore" -> Lore, "synergy" -> Synergy, both -> both side by side,
    // empty (similarity only) -> none.
    tags(c) {
      const e = c.evidence || [];
      return [...(e.includes('lore') ? ['Lore'] : []), ...(e.includes('synergy') ? ['Synergy'] : [])];
    },
    // The API sends no source titles, so the URL slug is turned into one.
    sourceLabel(url) {
      const u = new URL(url);
      const story = u.pathname.match(/magic-story\/([^/]+)/);
      if (!story) return u.hostname.replace(/^www\./, '');
      const words = story[1].replace(/-\d{4}-\d{2}-\d{2}$/, '').split('-').filter(Boolean);
      return 'Magic Story: ' + words.map((w, i) => (i && SMALL.has(w) ? w : w[0].toUpperCase() + w.slice(1))).join(' ');
    },
  };
})();
if (typeof module !== 'undefined') module.exports = Taleforge;

(function () {
  if (typeof document === 'undefined') return;
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  if (!query) { location.replace('index.html'); return; }
  let filters = TaleforgeFilters.fromParams(params);

  const GLOWS = ['amber', 'violet', 'teal', 'rose', 'sage', 'slate'];
  const SHOWN_SOURCES = 2; // per card; the rest sit behind "+N more"
  const TIPS = [
    'Check the spelling of names. Cards use official spellings.',
    'Name a character, plane, or guild from Magic’s story.',
    'Describe a feeling or play style instead, like “patient and cruel.”',
  ];

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // Only https links open; anything else from the API is shown as plain text.
  const safe = (href) => typeof href === 'string' && href.startsWith('https://');
  const link = (href, text, cls) => {
    if (!safe(href)) return el('span', cls, text);
    const a = el('a', cls, text + ' ↗');
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    return a;
  };
  const { sourceLabel } = Taleforge;
  // The article title from the API (source_titles, same order as source_urls), else a label made from the URL.
  const titleOf = (c, u) => (c.source_titles || [])[c.source_urls.indexOf(u)] || sourceLabel(u);
  const editHref = () => 'index.html?' + TaleforgeFilters.toParams(filters, new URLSearchParams({ q: query }));

  $('idea').textContent = '“' + query + '”';
  const syncEdit = () => { $('edit').href = editHref(); };
  syncEdit();
  $('loading-query').textContent = '“' + query + '”';

  // ---- mix ----
  // One slider, Lore on the left and Synergy on the right. balance (Lore share) is the state; the input holds 100 - balance.
  const mix = $('mix');
  const slider = $('balance');
  const balance = () => Taleforge.balanceFromInput(slider.value);
  const paint = () => {
    const b = balance();
    $('lore-out').textContent = 'Lore ' + b;
    $('synergy-out').textContent = 'Synergy ' + (100 - b);
    slider.setAttribute('aria-valuetext', `Lore ${b}%, Synergy ${100 - b}%`);
  };
  const setBalance = (b) => { slider.value = Taleforge.inputFromBalance(b); paint(); };
  setBalance(Taleforge.balanceFromParams(params));
  slider.addEventListener('input', paint);
  $('mix-reset').addEventListener('click', () => setBalance(Taleforge.DEFAULT_BALANCE));
  // The mix Update (or Enter in the commander field) runs one new search with both settings now.
  const current = () => ({ ...filterControls.get(), commander: commander.get() });
  const update = (e) => {
    if (e) e.preventDefault();
    later.cancel();
    filters = current();
    const u = new URL(location.href);
    ['story', 'synergy', 'similarity'].forEach((k) => u.searchParams.delete(k));
    u.searchParams.set('balance', balance());
    TaleforgeFilters.toParams(filters, u.searchParams);
    history.replaceState(null, '', u);
    syncEdit();
    search();
  };
  // Filter edits apply on their own: one search FILTER_DELAY after the last chip click,
  // skipped when the filters end up as they were. search() cancels the one in flight.
  const later = Taleforge.debounce(() => {
    if (JSON.stringify(current()) !== JSON.stringify(filters)) update();
  }, Taleforge.FILTER_DELAY);
  // The commander lives in its own Command zone box, out of the filters. It applies on Enter or blur, only if it
  // changed since the last search; a pending chip wait goes with it.
  const commit = () => { if (commander.get() !== filters.commander) update(); };
  const filterControls = TaleforgeFilters.mount($('filter-controls'), filters, later);
  const commander = TaleforgeFilters.mountCommander($('command-zone'), filters.commander, commit);
  $('command-zone').addEventListener('submit', (e) => e.preventDefault());
  mix.addEventListener('submit', update);
  $('filters').addEventListener('submit', update);
  $('filters-reset').addEventListener('click', () => { filterControls.set(TaleforgeFilters.empty()); later(); });

  // On narrow screens the aside stacks above the results, so its long filter panel starts folded.
  if (matchMedia('(max-width: 1000px)').matches) $('refine').open = false;

  // ---- rendering ----
  const setStep = (k) => [...$('steps').children].forEach((li, i) => {
    li.className = i < k ? 'done' : i === k ? 'active' : '';
  });

  const renderChips = (chips) => {
    const all = [...chips, ...TaleforgeFilters.chips(filters)];
    $('read-as').hidden = !all.length;
    $('chips').replaceChildren(...all.map((c) => el('span', 'chip', c)));
    $('mechanic-note').hidden = !Taleforge.showMechanicNote(chips, query);
  };

  // The commander, from commander_card, above the results: whole card image, name, color identity, Scryfall link.
  const renderCommander = (c) => {
    const box = $('commander');
    const pic = el('div', 'commander-art');
    if (c.image_url) {
      const img = el('img');
      img.src = c.image_url; img.alt = ''; img.width = 488; img.height = 680;
      pic.append(img);
    }
    const ci = c.color_identity || [];
    const colors = el('div', 'chips');
    colors.append(...(ci.length ? ci : ['Colorless']).map((x) => el('span', 'pip pip-' + x[0], x)));
    const text = el('div', 'commander-text');
    text.append(el('span', 'label', 'Command zone'), el('h2', null, c.name), el('span', 'label', 'Color identity'), colors);
    if (c.scryfall_url) text.append(link(c.scryfall_url, 'Scryfall', 'src'));
    box.replaceChildren(pic, text);
    box.hidden = false;
  };

  const cardEl = (c) => {
    const card = el('div', 'card');
    const pic = el(safe(c.scryfall_url) ? 'a' : 'div', 'art');
    if (safe(c.scryfall_url)) {
      pic.href = c.scryfall_url; pic.target = '_blank'; pic.rel = 'noopener';
      pic.setAttribute('aria-label', c.name + ' on Scryfall');
    }
    if (c.image_url) {
      const img = el('img');
      img.src = c.image_url; img.alt = ''; img.loading = 'lazy'; img.width = 488; img.height = 680;
      pic.append(img);
    }
    const meta = el('div', 'meta');
    const kinds = Taleforge.tags(c);
    if (kinds.length) {
      const s = c.scores || {};
      const pct = (v) => Math.round((v || 0) * 100) + '%';
      const wrap = el('div', 'tags');
      kinds.forEach((kind) => {
        const tag = el('span', 'tag tag-' + kind.toLowerCase(), kind);
        tag.title = kind === 'Lore' ? `Story ${pct(s.story)}` : `Synergy ${pct(s.synergy)}`;
        wrap.append(tag);
      });
      meta.append(wrap);
    }
    const links = el('div', 'links');
    if (c.scryfall_url) links.append(link(c.scryfall_url, 'Scryfall'));
    const sources = c.source_urls || [];
    const storyLink = (u) => {
      const a = link(u, 'Story');
      if (safe(u)) a.title = titleOf(c, u);
      return a;
    };
    links.append(...sources.slice(0, SHOWN_SOURCES).map(storyLink));
    const rest = sources.slice(SHOWN_SOURCES);
    if (rest.length) {
      const more = el('button', 'more-links', '+' + rest.length + ' more');
      more.type = 'button';
      more.addEventListener('click', () => {
        const added = rest.map(storyLink);
        more.replaceWith(...added);
        added[0].focus();
      });
      links.append(more);
    }
    meta.append(links);
    card.append(pic, el('h3', null, c.name));
    if (c.reason) card.append(el('p', null, c.reason));
    card.append(meta);
    return card;
  };

  const groupEl = (g, i) => {
    const art = el('article', 'group');
    art.style.setProperty('--glow', 'var(--side-' + GLOWS[i % GLOWS.length] + ')');
    const head = el('div', 'group-head');
    head.append(el('span', 'dot'), el('span', 'label', g.cards.length + (g.cards.length === 1 ? ' card' : ' cards')));
    art.append(head, el('h2', null, g.title), el('p', 'reasoning', g.explanation));
    if (g.cards.some((c) => c.reason)) {
      const sources = [...new Set(g.cards.flatMap((c) => c.source_urls || []))];
      const prov = el('div', 'provenance');
      prov.append(el('em', null, sources.length ? 'Written by AI from the linked sources.' : 'Written by AI from each card’s rules text.'));
      const owner = (s) => g.cards.find((c) => (c.source_urls || []).includes(s));
      sources.forEach((s) => prov.append(link(s, safe(s) ? titleOf(owner(s), s) : s, 'src')));
      art.append(prov);
    }
    const grid = el('div', 'cards');
    grid.append(...g.cards.map(cardEl));
    art.append(grid);
    return art;
  };

  // Card images appear only inside written groups. Until then, placeholders stand in for the cards
  // not yet placed; each group is added above them as it arrives, and nothing already shown moves.
  let found = [];
  let placed = new Set();
  let shownGroups = 0;
  const renderPlaceholders = () => {
    const left = found.filter((c) => !placed.has(c.name)).length;
    if (!left) { $('candidates').replaceChildren(); return; }
    const art = el('article', 'group candidates');
    art.style.setProperty('--glow', 'var(--side-slate)');
    art.setAttribute('aria-busy', 'true');
    const head = el('div', 'group-head');
    head.append(el('span', 'dot'), el('span', 'label', found.length + ' cards found, writing explanations'));
    const grid = el('div', 'cards');
    for (let i = 0; i < left; i++) {
      const card = el('div', 'card skeleton');
      card.setAttribute('aria-hidden', 'true');
      card.append(el('div', 'art'), el('span', 'bar'), el('span', 'bar short'));
      grid.append(card);
    }
    art.append(head, grid);
    $('candidates').replaceChildren(art);
  };

  const renderCandidates = (cards) => { found = cards; renderPlaceholders(); };

  // Groups are appended in arrival order (not by index) so a late group never pushes shown cards down.
  const renderGroup = (g) => {
    $('groups').append(groupEl(g, shownGroups++));
    g.cards.forEach((c) => placed.add(c.name));
    renderPlaceholders();
  };

  const renderDone = (data) => {
    if (!shownGroups) data.groups.forEach(renderGroup);
    const grouped = new Set(data.groups.flatMap((g) => g.cards.map((c) => c.name)));
    const more = found.filter((c) => !grouped.has(c.name));
    $('candidates').replaceChildren();
    if (more.length) {
      $('groups').append(groupEl({ title: 'More cards', cards: more,
        explanation: 'Ranked by your mix. No theme was written for these.' }, shownGroups));
    }
    const cardCount = grouped.size + more.length;
    $('loading').hidden = true;
    $('summary').hidden = false;
    $('summary-title').textContent = data.groups.length + (data.groups.length === 1 ? ' theme, ' : ' themes, ') + cardCount + ' cards';
    $('intro').textContent = data.intro;
    $('end-note').hidden = false;
  };

  const button = (text, cls, onClick) => {
    const b = el('button', 'btn btn-lg ' + cls, text);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  };
  const editButton = (cls) => button('Edit your idea', cls, () => { location.href = editHref(); });
  const banner = (tone, title, text) => {
    const b = el('div', 'banner banner-' + tone);
    const body = el('div');
    body.append(el('strong', null, title), text);
    b.append(body);
    return b;
  };

  const showState = (label, title, text, ...extra) => {
    $('loading').hidden = true;
    $('summary').hidden = true;
    $('end-note').hidden = true;
    $('groups').replaceChildren();
    $('candidates').replaceChildren();
    const st = $('state');
    st.replaceChildren(el('span', 'label', label), el('h1', null, title), el('p', null, text), ...extra);
    st.hidden = false;
  };
  const row = (...buttons) => { const r = el('div', 'row'); r.append(...buttons); return r; };

  const showEmpty = () => {
    const tips = el('div', 'tips');
    TIPS.forEach((t, i) => { const d = el('div'); d.append(el('span', null, '0' + (i + 1)), el('span', null, t)); tips.append(d); });
    showState('No matches', 'Nothing fit that idea yet.',
      `Taleforge looked for Commander-legal cards connected to “${query}” and found none it could explain. Rather than guess, it shows nothing.`,
      el('span', 'label', 'What usually helps'), tips, row(editButton('btn-primary')));
  };

  const showError = (status, body) => {
    if (status === 429) {
      showState('Daily limit', 'That’s today’s searches.',
        'Taleforge is free and runs on a small budget, so it allows a limited number of searches each day. There’s no account to upgrade and no paid tier.',
        banner('warning', 'Daily limit reached', 'Searches reset at midnight, server time. Your idea is kept, so you can search it again then.'),
        row(editButton('btn-secondary')));
    } else if (status === 503) {
      const idea = el('p', 'idea', '“' + query + '”');
      showState('Paused', 'Search is paused.',
        'Taleforge has paused new searches for now. Your idea is kept below and will be ready to search when it’s back.',
        idea, row(button('Check now', 'btn-secondary', search), editButton('btn-ghost')));
    } else if (status === 400 && body && body.error === 'not_a_commander') {
      showState('Check your commander', 'That card can\'t be a commander.',
        'Pick a legendary creature or a card that says it can be your commander.',
        row(editButton('btn-primary')));
    } else if (status === 400 && body && body.error === 'unknown_commander') {
      showState('Check your commander', 'That commander wasn’t found.',
        'Taleforge looks the name up in its own card data. Check the spelling, or clear the commander field to search without one.',
        row(editButton('btn-primary')));
    } else if (status === 400) {
      showState('Check your idea', 'That idea can’t be searched.', (body && body.message) || 'Edit your idea and try again.',
        row(editButton('btn-primary')));
    } else {
      showState('Interrupted', 'The search didn’t finish.',
        'The connection dropped or the server hit an error partway through. Your idea is still here, so you can try again.',
        row(button('Try again', 'btn-primary', search), editButton('btn-ghost')));
    }
  };

  // ---- search ----
  // Returns true for an event that ends the search.
  const handle = (event, data) => {
    if (data && data.commander_card) renderCommander(data.commander_card);
    if (event === 'understood') { renderChips(data.chips); setStep(1); }
    else if (event === 'cards') { renderCandidates(data.cards); setStep(2); }
    else if (event === 'explanation') renderGroup(data);
    else if (event === 'done') {
      renderChips(data.chips || []);
      if (data.error === 'empty' || !data.groups.length) showEmpty(); else renderDone(data);
      return true;
    } else if (event === 'error') { showError(500, data); return true; }
    return false;
  };

  let controller = null;
  async function search() {
    if (controller) controller.abort();
    const run = controller = new AbortController();
    shownGroups = 0; found = []; placed = new Set();
    $('state').hidden = true;
    $('commander').hidden = true;
    $('summary').hidden = true;
    $('end-note').hidden = true;
    $('groups').replaceChildren();
    $('candidates').replaceChildren();
    $('loading').hidden = false;
    setStep(0);
    const weights = Taleforge.weights(balance());
    let finished = false;
    try {
      const res = await fetch('/api/search?stream=1', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, weights, ...TaleforgeFilters.body(filters) }), signal: run.signal,
      });
      if (!(res.headers.get('Content-Type') || '').startsWith('text/event-stream')) {
        showError(res.status, await res.json().catch(() => null));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let i;
        while (!finished && (i = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, i);
          buf = buf.slice(i + 2);
          let event = 'message', data = '';
          chunk.split('\n').forEach((line) => {
            if (line.startsWith('event: ')) event = line.slice(7);
            else if (line.startsWith('data: ')) data += line.slice(6);
          });
          finished = handle(event, JSON.parse(data));
        }
      }
      if (!finished && !run.signal.aborted) showError(0);
    } catch (e) {
      if (!run.signal.aborted) showError(0);
    }
  }

  $('cancel').addEventListener('click', () => {
    if (controller) controller.abort();
    location.href = editHref();
  });

  search();
})();
