/* deeplinks.js — shareable URLs for functions and videos.
 *
 *   /#frying              -> shows only the Fry videos
 *   /#frying/crispy-fries -> shows Fry videos and opens that video
 *   /  (no hash)          -> all videos
 *
 * Works purely from the rendered cards (.r-card > .r-fn / .r-title), so it
 * does not depend on the shape of recipes-data.js. Load AFTER script.js.
 */
(function () {
  'use strict';

  var grid = document.getElementById('recipeGrid');
  var lightbox = document.getElementById('lightbox');
  var bar = document.getElementById('fnFilterBar');
  if (!grid) return;

  // function label (as shown on the card) -> URL slug
  var FN_SLUGS = {
    bake: 'baking', baking: 'baking',
    steam: 'steaming', steaming: 'steaming',
    grill: 'grilling', grilling: 'grilling',
    fry: 'frying', frying: 'frying', 'deep fry': 'frying', 'deep frying': 'frying',
    microwave: 'microwave', microwaving: 'microwave',
    induction: 'induction',
    sauteing: 'sauteing', 'sautéing': 'sauteing', saute: 'sauteing',
    'microwave + induction': 'microwave-induction'
  };
  var FN_LABELS = {
    baking: 'Baking', steaming: 'Steaming', grilling: 'Grilling',
    frying: 'Frying', microwave: 'Microwave', induction: 'Induction',
    sauteing: 'Sautéing', 'microwave-induction': 'Microwave + Induction'
  };

  function slugify(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function fnSlug(label) {
    var key = String(label || '').toLowerCase().trim();
    return FN_SLUGS[key] || slugify(key);
  }

  var cards = [];      // [{el, fn, id}]
  var byId = {};

  function index() {
    cards = [];
    byId = {};
    var seen = {};
    var els = grid.querySelectorAll('.r-card:not(.ghost)');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var fnEl = el.querySelector('.r-fn');
      var titleEl = el.querySelector('.r-title');
      if (!titleEl) continue;
      var fn = fnSlug(fnEl ? fnEl.textContent : '');
      var base = slugify(titleEl.textContent) || 'video';
      var id = base;
      var n = 2;
      while (seen[fn + '/' + id]) { id = base + '-' + n++; }
      seen[fn + '/' + id] = true;
      var rec = { el: el, fn: fn, id: id };
      cards.push(rec);
      byId[fn + '/' + id] = rec;
      el.setAttribute('data-fn-slug', fn);
      el.setAttribute('data-video-slug', id);
    }
  }

  function parseHash() {
    var h = decodeURIComponent((location.hash || '').replace(/^#/, '')).toLowerCase();
    var parts = h.split('/');
    return { fn: parts[0] || '', video: parts[1] || '' };
  }

  function applyFilter(fn) {
    var shown = 0;
    cards.forEach(function (c) {
      var on = !fn || c.fn === fn;
      c.el.style.display = on ? '' : 'none';
      if (on) shown++;
    });
    // ghost / placeholder cards: hide while filtering
    var ghosts = grid.querySelectorAll('.r-card.ghost');
    for (var i = 0; i < ghosts.length; i++) ghosts[i].style.display = fn ? 'none' : '';

    if (!bar) return;
    if (fn && shown) {
      var label = FN_LABELS[fn] || fn.charAt(0).toUpperCase() + fn.slice(1);
      bar.innerHTML = '<span>Showing: ' + label + ' videos</span><a href="#">View all videos</a>';
      bar.classList.add('is-visible');
    } else {
      bar.classList.remove('is-visible');
      bar.innerHTML = '';
    }
  }

  function lightboxOpen() {
    return lightbox && lightbox.classList.contains('open');
  }

  var applying = false;

  function applyHash() {
    index();
    var h = parseHash();
    var fn = h.fn;

    // unknown function slug -> show everything
    var known = cards.some(function (c) { return c.fn === fn; });
    applyFilter(known ? fn : '');

    if (h.video) {
      var rec = byId[fn + '/' + h.video];
      if (rec && !lightboxOpen()) {
        applying = true;
        rec.el.click();
        applying = false;
      }
    } else if (lightboxOpen()) {
      var closeBtn = document.getElementById('lightboxClose');
      if (closeBtn) closeBtn.click();
    }
  }

  // clicking a card -> put its link in the address bar (no extra history entry)
  grid.addEventListener('click', function (e) {
    if (applying) return;
    var card = e.target.closest ? e.target.closest('.r-card') : null;
    if (!card || card.classList.contains('ghost')) return;
    var fn = card.getAttribute('data-fn-slug');
    var id = card.getAttribute('data-video-slug');
    if (!fn || !id) return;
    history.replaceState(null, '', '#' + fn + '/' + id);
  }, true);

  // closing the video -> fall back to the function link (or clean URL)
  if (lightbox) {
    new MutationObserver(function () {
      if (lightboxOpen() || applying) return;
      var h = parseHash();
      if (h.video) {
        history.replaceState(null, '', h.fn ? '#' + h.fn : location.pathname + location.search);
      }
    }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }

  // wait for script.js to render the cards, then act on the hash
  var started = false;
  function start() {
    if (started) return;
    if (!grid.querySelector('.r-card')) return;
    started = true;
    applyHash();
  }

  new MutationObserver(function () {
    if (!started) { start(); return; }
    // grid re-rendered (e.g. by script.js) -> re-tag and re-apply the filter
    var h = parseHash();
    index();
    applyFilter(cards.some(function (c) { return c.fn === h.fn; }) ? h.fn : '');
  }).observe(grid, { childList: true });

  window.addEventListener('hashchange', function () {
    if (started) applyHash();
  });

  start();
  window.addEventListener('load', start);
})();
