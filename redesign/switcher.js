/* ═══════════════════════════════════════════════════════════════════════
 * redesign/switcher.js
 *   Preview-only Variant- + Page- + Viewport-Switcher.
 *   Liest Variant aus ?v=a|b|c oder ?baseline=1.
 *   Liest Viewport-Modus aus ?frame=auto|mobile|desktop.
 *
 *   Modus = mobile|desktop:
 *     - Aktuelle Page wird in einen Device-Frame-iframe gepackt
 *     - Innerhalb des iframes (?_inframe=1) wird der Switcher ausgeblendet,
 *       damit nur ein Switcher sichtbar ist (im Outer-Frame).
 * ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PAGES = (window.__EGR_PAGES__ || []);

  function init() {
    ensureCssInHead();
    var p   = new URLSearchParams(location.search);
    var current = (p.get('baseline') === '1') ? 'baseline' : ((p.get('v') || 'a').toLowerCase());
    var frame   = (p.get('frame') || 'auto').toLowerCase();
    if (!/^(auto|mobile|desktop)$/.test(frame)) frame = 'auto';
    var inframe = p.get('_inframe') === '1';

    if (inframe) {
      // Inside the device-iframe: mark body so CSS hides the switcher
      document.body.classList.add('egr-inframe');
      // Also make sure the inner page can't recursively wrap itself
      return;
    }

    if (frame === 'mobile' || frame === 'desktop') {
      buildFrameMode(frame, current);
      return;
    }

    buildSwitcher(current, frame);
  }

  // ── Build the floating switcher widget ─────────────────────────────────
  function buildSwitcher(current, frame) {
    if (document.getElementById('egr-switcher')) return;

    var aside = document.createElement('aside');
    aside.className = 'egr-preview-switcher';
    aside.id = 'egr-switcher';
    aside.setAttribute('aria-label', 'Preview-Switcher');
    aside.setAttribute('data-egr-noprint', '');

    aside.innerHTML =
      '<strong>Variant</strong>' +
      '<div class="row" id="egr-switcher-variants"></div>' +
      '<strong>Viewport</strong>' +
      '<div class="row" id="egr-switcher-viewport"></div>' +
      '<strong>Page</strong>' +
      '<select id="egr-switcher-page"></select>';

    document.body.appendChild(aside);

    var thisFile = currentPageFile();

    // Variant buttons
    var rowVar = document.getElementById('egr-switcher-variants');
    var variants = [
      ['a',        'A · Fairway'],
      ['b',        'B · Tour Pro'],
      ['c',        'C · Stat-Lab'],
      ['baseline', 'Baseline']
    ];
    variants.forEach(function (v) {
      var a = document.createElement('a');
      a.textContent = v[1];
      a.href = thisFile + buildQS({ variant: v[0], frame: frame });
      if (v[0] === current) a.className = 'is-active';
      rowVar.appendChild(a);
    });

    // Viewport buttons
    var rowVp = document.getElementById('egr-switcher-viewport');
    var viewports = [
      ['auto',    'Auto'],
      ['mobile',  '\uD83D\uDCF1 Mobile'],   // 📱
      ['desktop', '\uD83D\uDCBB Desktop']   // 💻
    ];
    viewports.forEach(function (vp) {
      var a = document.createElement('a');
      a.textContent = vp[1];
      a.href = thisFile + buildQS({ variant: current, frame: vp[0] });
      a.title = vp[0] === 'mobile' ? 'Vorschau in Smartphone-Frame (390 × 844)'
              : vp[0] === 'desktop' ? 'Vorschau in Desktop-Frame (1280 × 820)'
              : 'Native Browser-Auflösung — kein Frame';
      if (vp[0] === frame) a.className = 'is-active';
      rowVp.appendChild(a);
    });

    // Page select
    var sel = document.getElementById('egr-switcher-page');
    PAGES.forEach(function (pg) {
      var o = document.createElement('option');
      o.value = pg[0];
      o.textContent = pg[1];
      if (pg[0] === thisFile) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () {
      location.href = sel.value + buildQS({ variant: current, frame: frame });
    });
  }

  // ── Frame mode: wrap current page into device-iframe ───────────────────
  function buildFrameMode(frame, current) {
    document.body.classList.add('egr-frame-mode');

    // Strip everything inside the body except scripts/stylesheets we need
    // (preserve <script>, <link>, <style>, <noscript>, <template> so the
    // switcher's CSS link in body survives if it wasn't yet hoisted to head).
    var keep = [];
    document.body.childNodes.forEach(function (n) {
      if (n.nodeType === 1 && /^(SCRIPT|LINK|STYLE|NOSCRIPT|TEMPLATE)$/i.test(n.tagName)) {
        keep.push(n);
      }
    });
    document.body.innerHTML = '';
    keep.forEach(function (n) { document.body.appendChild(n); });

    // Build the device stage
    var stage = document.createElement('div');
    stage.className = 'egr-device-stage';

    var dev = document.createElement('div');
    dev.className = 'egr-device ' + frame;

    var ifr = document.createElement('iframe');
    ifr.title = (frame === 'mobile' ? 'Mobile Preview' : 'Desktop Preview');
    ifr.loading = 'eager';
    ifr.src = currentPageFile() + buildInnerQS(current);

    dev.appendChild(ifr);

    var label = document.createElement('div');
    label.className = 'egr-device-label';
    label.textContent = (frame === 'mobile')
      ? '\uD83D\uDCF1 Mobile · 390 × 844 · ' + variantLabel(current)
      : '\uD83D\uDCBB Desktop · 1280 × 820 · ' + variantLabel(current);

    stage.appendChild(dev);
    stage.appendChild(label);
    document.body.appendChild(stage);

    // Re-build the switcher (so it's visible above the frame)
    buildSwitcher(current, frame);
  }

  // ── helpers ────────────────────────────────────────────────────────────
  // Make sure switcher.css lives in <head>, so it survives even if a
  // <link> in <body> gets wiped (which happens in frame-mode).
  function ensureCssInHead() {
    var head = document.head;
    if (!head) return;
    if (head.querySelector('link[data-egr-switcher-css]')) return;
    // If a body-level link already loaded it, replicate into head; otherwise
    // create fresh.
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = scriptDir() + 'switcher.css';
    link.setAttribute('data-egr-switcher-css', '');
    head.appendChild(link);
  }

  function scriptDir() {
    // Resolve directory of this script so the CSS sits next to it.
    var s = document.currentScript
         || document.querySelector('script[src*="switcher.js"]');
    if (!s || !s.src) return 'redesign/';
    var u = s.src.split('?')[0];
    return u.substring(0, u.lastIndexOf('/') + 1);
  }

  function currentPageFile() {
    var f = location.pathname.split('/').pop();
    return (!f || f === '') ? 'home.html' : f;
  }

  function buildQS(opts) {
    var qs = new URLSearchParams();
    if (opts.variant === 'baseline') qs.set('baseline', '1');
    else qs.set('v', opts.variant);
    if (opts.frame && opts.frame !== 'auto') qs.set('frame', opts.frame);
    var s = qs.toString();
    return s ? '?' + s : '';
  }

  function buildInnerQS(current) {
    var qs = new URLSearchParams();
    if (current === 'baseline') qs.set('baseline', '1');
    else qs.set('v', current);
    qs.set('_inframe', '1');
    qs.set('_t', Date.now());
    return '?' + qs.toString();
  }

  function variantLabel(v) {
    if (v === 'baseline') return 'Baseline';
    return 'Variant ' + v.toUpperCase();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
