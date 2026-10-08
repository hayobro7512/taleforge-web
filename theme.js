// Theme: dark by default, light on request. Tone: "lifted" (default) or "original" dark neutrals.
// Both remembered per browser when storage works.
(function () {
  var root = document.documentElement;
  try {
    if (localStorage.getItem('tf-theme') === 'light') root.dataset.theme = 'light';
    if (localStorage.getItem('tf-tone') === 'original') root.dataset.tone = 'original';
  } catch (e) {}
  var label = function () {
    document.querySelectorAll('.tone-toggle').forEach(function (b) {
      var original = root.dataset.tone === 'original';
      b.textContent = original ? 'Original' : 'Lifted';
      b.setAttribute('aria-label', 'Dark tone: ' + (original ? 'original' : 'lifted') + '. Switch tone');
    });
  };
  document.addEventListener('DOMContentLoaded', label);
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('tf-theme', next); } catch (err) {}
    } else if (e.target.closest('.tone-toggle')) {
      var tone = root.dataset.tone === 'original' ? 'lifted' : 'original';
      root.dataset.tone = tone;
      try { localStorage.setItem('tf-tone', tone); } catch (err) {}
      label();
    }
  });
})();
