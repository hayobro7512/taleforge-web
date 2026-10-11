// Filters shared by index.html and results.html: color chips, card-type chips, optional commander (contract: API.md).
// Pure helpers are tested through node (tests/test_helpers.py); mount() builds the controls.
const TaleforgeFilters = (() => {
  const COLORS = [['W', 'White'], ['U', 'Blue'], ['B', 'Black'], ['R', 'Red'], ['G', 'Green']];
  const COLORLESS = 'C';
  const TYPES = ['Creature', 'Instant', 'Sorcery', 'Artifact', 'Enchantment', 'Planeswalker', 'Land'];
  const MAX_COMMANDER = 100;
  const LETTERS = COLORS.map(([l]) => l);
  const inOrder = (all, picked) => all.filter((x) => picked.includes(x));
  const list = (p, k) => (p.get(k) || '').split(',').map((s) => s.trim()).filter(Boolean);

  const empty = () => ({ colors: [], types: [], commander: '' });

  // ?colors=W,U (or C alone for colorless), ?types=Creature,Instant, ?commander=Name. Unknown values are dropped.
  const fromParams = (p) => {
    const raw = list(p, 'colors');
    const colors = raw.includes(COLORLESS) ? [COLORLESS] : inOrder(LETTERS, raw);
    const commander = (p.get('commander') || '').split(/\s+/).filter(Boolean).join(' ').slice(0, MAX_COMMANDER);
    return { colors, types: inOrder(TYPES, list(p, 'types')), commander };
  };

  const toParams = (f, p) => {
    [['colors', f.colors.join(',')], ['types', f.types.join(',')], ['commander', f.commander]]
      .forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    return p;
  };

  // Request fields for API.md: only the ones that are set.
  const body = (f) => {
    const out = {};
    if (f.colors.length) out.colors = f.colors;
    if (f.types.length) out.types = f.types;
    if (f.commander) out.commander = f.commander;
    return out;
  };

  // Colorless clears the colors; a color clears Colorless.
  const toggleColor = (colors, c) => {
    if (c === COLORLESS) return colors.includes(COLORLESS) ? [] : [COLORLESS];
    const rest = colors.filter((x) => x !== COLORLESS);
    return inOrder(LETTERS, rest.includes(c) ? rest.filter((x) => x !== c) : [...rest, c]);
  };
  const toggleType = (types, t) => inOrder(TYPES, types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);

  // "Read as" chips for the filters in force.
  const chips = (f) => [
    ...(f.colors.length ? [f.colors[0] === COLORLESS ? 'Filter · Colors: Colorless' : 'Filter · Colors: ' + f.colors.join(', ')] : []),
    ...(f.types.length ? ['Filter · Card type: ' + f.types.join(', ')] : []),
    ...(f.commander ? ['Filter · Commander: ' + f.commander] : []),
  ];

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Builds the controls inside root and returns { get, set }. onChange runs after every chip click.
  // The commander field only calls onCommit (default: onChange) on Enter or blur, never while typing;
  // with an onCommit, Enter does not submit the form.
  const mount = (root, initial, onChange = () => {}, onCommit) => {
    let state = { ...empty(), ...initial };
    const group = (title, ...kids) => {
      const fs = el('fieldset', 'filter-group');
      fs.append(el('legend', 'label', title), ...kids);
      return fs;
    };
    const toggle = (text, label, isOn, click) => {
      const b = el('button', 'chip-toggle', text);
      b.type = 'button';
      if (label) b.setAttribute('aria-label', label);
      b.addEventListener('click', () => { click(); paint(); onChange(state); });
      return { b, isOn };
    };
    const colorBtns = [
      ...COLORS.map(([l, name]) => toggle(l, name, () => state.colors.includes(l), () => { state.colors = toggleColor(state.colors, l); })),
      toggle('Colorless', 'Colorless', () => state.colors.includes(COLORLESS), () => { state.colors = toggleColor(state.colors, COLORLESS); }),
    ];
    const typeBtns = TYPES.map((t) => toggle(t, null, () => state.types.includes(t), () => { state.types = toggleType(state.types, t); }));
    const row = (btns) => { const r = el('div', 'chip-row'); r.append(...btns.map((x) => x.b)); return r; };
    const input = el('input');
    input.type = 'text'; input.name = 'commander'; input.maxLength = MAX_COMMANDER; input.autocomplete = 'off';
    input.placeholder = 'e.g. Atraxa, Praetors’ Voice';
    input.addEventListener('input', () => { state.commander = input.value.split(/\s+/).filter(Boolean).join(' '); });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !onCommit) return;
      e.preventDefault();
      onCommit(state);
    });
    input.addEventListener('blur', () => (onCommit || onChange)(state));
    const field = el('label', 'field');
    field.append(el('span', 'label', 'Commander (optional)'), input);
    const paint = () => [...colorBtns, ...typeBtns].forEach(({ b, isOn }) => b.setAttribute('aria-pressed', String(isOn())));
    root.append(
      group('Colors', row(colorBtns)),
      group('Card types', row(typeBtns)),
      field,
    );
    const set = (f) => { state = { ...empty(), ...f }; input.value = state.commander; paint(); };
    set(state);
    return { get: () => ({ colors: [...state.colors], types: [...state.types], commander: state.commander }), set };
  };

  return { COLORS, TYPES, COLORLESS, MAX_COMMANDER, empty, fromParams, toParams, body, toggleColor, toggleType, chips, mount };
})();
if (typeof module !== 'undefined') module.exports = TaleforgeFilters;
