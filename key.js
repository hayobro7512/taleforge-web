// Optional "use your own OpenAI key": kept only in this browser (localStorage), sent as the X-OpenAI-Key header.
// With a key, searches skip the free daily limit and are billed to the key's owner. Contract: API.md.
const TaleforgeKey = (() => {
  const NAME = 'taleforge.openaiKey';
  const get = () => { try { return localStorage.getItem(NAME) || ''; } catch (e) { return ''; } };
  const set = (k) => { try { k ? localStorage.setItem(NAME, k) : localStorage.removeItem(NAME); } catch (e) { /* storage blocked */ } };
  // Request headers to merge into fetch().
  const headers = () => (get() ? { 'X-OpenAI-Key': get() } : {});
  // Fills root with the key field. onSave runs after a key is saved or removed.
  const mount = (root, onSave = () => {}) => {
    const el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    };
    const input = el('input', 'key-input');
    input.type = 'password'; input.autocomplete = 'off'; input.spellcheck = false;
    input.placeholder = 'sk-…'; input.setAttribute('aria-label', 'Your OpenAI API key');
    input.value = get();
    const status = el('span', 'note');
    const paint = () => { status.textContent = get() ? 'Saved in this browser. Searches use your key and have no daily limit.' : ''; };
    const save = el('button', 'btn btn-secondary btn-sm', 'Save key');
    save.type = 'button';
    save.addEventListener('click', () => { set(input.value.trim()); paint(); onSave(); });
    const clear = el('button', 'btn btn-ghost btn-sm', 'Remove');
    clear.type = 'button';
    clear.addEventListener('click', () => { input.value = ''; set(''); paint(); onSave(); });
    const row = el('div', 'row');
    row.append(input, save, clear);
    root.replaceChildren(
      el('p', 'note', 'Free searches are limited each day. Add your own OpenAI API key to search without that limit. ' +
        'The key stays in this browser and is sent with each search to be used once. Taleforge does not store or log it, and OpenAI bills your account (about a cent per search).'),
      row, status);
    paint();
  };
  return { get, set, headers, mount };
})();
