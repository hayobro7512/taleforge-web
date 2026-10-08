// Results page: streams POST /api/search?stream=1 (contract in API.md) and renders events as they arrive.

// Pure helpers; tests/test_server.py loads them through node.
const Taleforge = (() => {
  const DEFAULT_BALANCE = 62; // Lore share of Lore+Synergy; 62 ~ the ranker's default 50:30
  const GUILDS = /\b(azorius|dimir|rakdos|gruul|selesnya|orzhov|izzet|golgari|boros|simic)\b/i;
  const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'vs', 'with']);
  const pct = (p, k) => {
    const v = p.has(k) && p.get(k) !== '' ? Number(p.get(k)) : NaN;
    return v >= 0 && v <= 100 ? v : NaN;
  };
  return {
    DEFAULT_BALANCE,
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
    // Lore = name match or story link; Synergy = deck synergy; Both = both; null = neither (similarity only).
    tag(c) {
      const s = c.scores || {};
      const lore = c.evidence === 'name match' || s.story > 0;
      const synergy = s.synergy > 0;
      return lore && synergy ? 'Both' : lore ? 'Lore' : synergy ? 'Synergy' : null;
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
  const editHref = 'index.html?q=' + encodeURIComponent(query);

  $('idea').textContent = '“' + query + '”';
  $('edit').href = editHref;
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
  mix.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = new URL(location.href);
    ['story', 'synergy', 'similarity'].forEach((k) => u.searchParams.delete(k));
    u.searchParams.set('balance', balance());
    history.replaceState(null, '', u);
    search();
  });

  // ---- rendering ----
  const setStep = (k) => [...$('steps').children].forEach((li, i) => {
    li.className = i < k ? 'done' : i === k ? 'active' : '';
  });

  const renderChips = (chips) => {
    $('read-as').hidden = !chips.length;
    $('chips').replaceChildren(...chips.map((c) => el('span', 'chip', c)));
    $('mechanic-note').hidden = !Taleforge.showMechanicNote(chips, query);
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
    const kind = Taleforge.tag(c);
    if (kind) {
      const tag = el('span', 'tag tag-' + kind.toLowerCase(), kind);
      const s = c.scores || {};
      const pct = (v) => Math.round((v || 0) * 100) + '%';
      tag.title = `Story ${pct(s.story)} · Synergy ${pct(s.synergy)} · Similarity ${pct(s.similarity)}`;
      meta.append(tag);
    }
    const links = el('div', 'links');
    if (c.scryfall_url) links.append(link(c.scryfall_url, 'Scryfall'));
    const storyLink = (u) => {
      const a = link(u, 'Story');
      if (safe(u)) a.title = sourceLabel(u);
      return a;
    };
    const sources = c.source_urls || [];
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
      sources.forEach((s) => prov.append(link(s, safe(s) ? sourceLabel(s) : s, 'src')));
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
  const editButton = (cls) => button('Edit your idea', cls, () => { location.href = editHref; });
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
        body: JSON.stringify({ query, weights }), signal: run.signal,
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
    location.href = editHref;
  });

  search();
})();
