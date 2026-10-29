// Shared footer for every page: privacy line, the exact disclaimer from disclaimer.txt, and data credits.
// Pages include an empty <footer class="site-footer"></footer> before this script.
(function () {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;
  const base = document.currentScript.src;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const a = (href, text) => {
    const n = el('a', null, text);
    n.href = href; n.target = '_blank'; n.rel = 'noopener';
    return n;
  };

  const privacy = el('p', null, 'No account needed. Your idea is sent to OpenAI to read it and write the explanations. ' +
    'Taleforge doesn’t save it: the server logs only the time, cost and duration of each search, and keeps results in memory until it restarts. ' +
    'If you add your own OpenAI key, it stays in your browser and is sent with each search to be used once, never stored or logged.');
  const disclaimer = el('p', 'disclaimer');
  const credits = el('p', 'credits');
  credits.append(
    'Card data and images: ', a('https://scryfall.com', 'Scryfall'),
    ' · Wiki links: MTG Wiki, ', a('https://creativecommons.org/licenses/by-nc-sa/4.0/', 'CC BY-NC-SA 4.0'),
    ' · Deck statistics: Moxfield',
    ' · Precon deck lists: MTGJSON, MIT license',
  );
  footer.replaceChildren(privacy, disclaimer, credits);

  // The wording lives only in disclaimer.txt, so pages cannot drift apart.
  fetch(new URL('disclaimer.txt', base))
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((t) => { disclaimer.textContent = t.trim(); })
    .catch(() => { disclaimer.remove(); });
})();
