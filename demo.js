// Static demo for GitHub Pages, which has no search server. There the pages turn off live search, and
// results.html replays a search recorded from the real server: demo/NN.sse, NN = the query's place in this list.
// Anywhere else TaleforgeDemo is null and the live API is used.
// ponytail: demo mode keys on the github.io host; give it a flag if the demo ever moves to another host.
const TaleforgeDemo = /\.github\.io$/.test(location.hostname) ? (() => {
  const QUERIES = [
    'Give me a deck built around Nicol Bolas and Ugin',
    'A deck about Liliana\'s betrayal of Bolas',
    'A War of the Spark rivalry deck',
    'A deck built around Nicol Bolas, the Elder Dragon',
    'A deck about Liliana\'s pact with the demons',
    'A Jace Beleren mind-games deck',
    'A Chandra Nalaar fire-and-fury deck',
    'A deck about Gideon\'s sacrifice',
    'A deck about Ugin and the Eldrazi',
    'A Teferi time-bending deck',
    'A Sorin Markov vampire deck',
    'A Nissa Revane deck about Zendikar\'s fury',
    'An Ajani Goldmane deck about his fall to Phyrexia',
    'A Karn, the silver golem deck',
    'An Elspeth Tirel deck about her fight for Theros',
  ];
  const norm = (q) => q.split(/\s+/).join(' ').trim().toLowerCase();
  return {
    QUERIES,
    // The recording for a query (spacing and case ignored), or null when it wasn't recorded.
    file(q) {
      const i = QUERIES.findIndex((x) => norm(x) === norm(q));
      return i < 0 ? null : 'demo/' + String(i).padStart(2, '0') + '.sse';
    },
    // The parts of a page that need the live server are hidden, and the Beta badge reads Demo.
    hide(...ids) {
      ids.forEach((id) => { document.getElementById(id).hidden = true; });
      document.querySelector('.badge').textContent = 'Demo';
    },
  };
})() : null;
