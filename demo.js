// Static demo for GitHub Pages, which has no search server. There the pages turn off live search, and
// results.html replays a search recorded from the real server: demo/NN.sse, NN = the query's place in this list.
// Anywhere else TaleforgeDemo is null and the live API is used.
// ponytail: demo mode keys on the github.io host; give it a flag if the demo ever moves to another host.
const TaleforgeDemo = /\.github\.io$/.test(location.hostname) ? (() => {
  const QUERIES = [
    'Cards on the downfall and defeat of Bolas in War of the Spark',
    'Synergy cards for a Murders at Karlov Manor deck',
    'The 2015 Battle for Zendikar Eldrazi',
    'Jace, Multiverse Architect: a planeswalker tribal deck with reality-fracture themed Jace and planeswalker cards',
  ];
  const norm = (q) => q.split(/\s+/).join(' ').trim().toLowerCase();
  return {
    QUERIES,
    // The recording for a query (spacing and case ignored), or null when it wasn't recorded.
    file(q) {
      const i = QUERIES.findIndex((x) => norm(x) === norm(q));
      return i < 0 ? null : 'demo/' + String(i).padStart(2, '0') + '.sse';
    },
    // The parts of a page that need the live server (or lead to unrecorded ideas) are hidden, and the Beta badge reads Demo.
    hide(...ids) {
      ids.forEach((id) => { document.getElementById(id).hidden = true; });
      document.querySelector('.badge').textContent = 'Demo';
    },
  };
})() : null;
