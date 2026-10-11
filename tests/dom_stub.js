// Just enough of a DOM to run TaleforgeFilters.mount in node (no jsdom installed).
class El {
  constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.listeners = {}; this.className = ''; this.textContent = ''; this.value = ''; }
  append(...k) { this.children.push(...k); }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(e, f) { (this.listeners[e] = this.listeners[e] || []).push(f); }
  fire(e) { (this.listeners[e] || []).forEach((f) => f({})); }
  find(pred, out = []) { if (pred(this)) out.push(this); this.children.forEach((c) => c.find(pred, out)); return out; }
}
global.document = { createElement: (t) => new El(t) };
module.exports = El;
