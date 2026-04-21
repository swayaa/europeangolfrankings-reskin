#!/usr/bin/env python3
"""
build_preview.py
================
Konvertiert alle Subpages in mirror/_subpages/*.html zu preview-tauglichen Seiten:
  • injiziert den standardisierten Variant-Switcher-Head
  • rewrited /assets/foo  →  assets/foo
  • rewrited absolute Live-URLs auf relative Preview-Pfade
  • setzt body[data-egr-page] für Per-Page-Hooks im CSS

Usage: python3 tools/build_preview.py
"""
from __future__ import annotations
import os
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "mirror/www.europeangolfrankings.com/_subpages"
DST = ROOT / "preview"
ASSETS_SRC = ROOT / "mirror/www.europeangolfrankings.com/assets"
PAGE_IMAGES_SRC = ROOT / "mirror/www.europeangolfrankings.com/page_images"
ADS_SRC = ROOT / "mirror/www.europeangolfrankings.com/ads"

# URL-Mapping: live-Pfad → preview-Datei
URL_MAP: dict[str, str] = {
    "/":                                        "home.html",
    "/ranking":                                 "ranking.html",
    "/ranking_women":                           "ranking_women.html",
    "/events":                                  "events.html",
    "/how-to-use":                              "how-to-use.html",
    "/about-us":                                "about-us.html",
    "/tours":                                   "tours.html",
    "/users/sign_in":                           "sign_in.html",
    "/users/sign_up":                           "sign_up.html",
    "/female":                                  "female.html",
    "/male":                                    "male.html",
    "/seite/copyright":                         "copyright.html",
    "/seite/privacy":                           "privacy.html",
    "/seite/terms":                             "terms.html",
    "/seite/contact":                           "contact.html",
    "/seite/imprint":                           "imprint.html",
    "/rankings/scandinavian_boys":              "scandinavian_boys.html",
    "/rankings/scandinavian_girls":             "scandinavian_girls.html",
    "/tours/Dutch_jongens_u21/ranking":         "dutch_jongens.html",
    "/tours/Dutch_meisjes_u21/ranking":         "dutch_meisjes.html",
    "/search":                                  "search.html",
}

# Subpage-Filename → body data-page-Hook (für CSS-Targeting)
PAGE_KIND: dict[str, str] = {
    "home":              "home",
    "ranking":           "rankings",
    "ranking_women":     "rankings",
    "scandinavian_boys": "rankings",
    "scandinavian_girls":"rankings",
    "dutch_jongens":     "rankings",
    "dutch_meisjes":     "rankings",
    "events":            "events",
    "how-to-use":        "pages",
    "about-us":          "pages",
    "tours":             "pages",
    "sign_in":           "sessions",
    "sign_up":           "sessions",
    "female":            "gender-overview",
    "male":              "gender-overview",
    "copyright":         "pages",
    "privacy":           "pages",
    "terms":             "pages",
    "contact":           "pages",
    "imprint":           "pages",
    "search":            "search",
}

NEW_HEAD = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Preview-Bundle: bewusst NICHT von Suchmaschinen indexieren, damit
       der Re-Skin nicht versehentlich als „echte" Site auftaucht.
       Robots.txt liefert zusätzlich Disallow für brave Crawler. -->
  <meta name="robots" content="noindex,nofollow,noarchive" />
  <title>European Golf Rankings — Re-Skin Preview</title>

  <!-- ───── Original-CSS (Baseline). Wird bei aktivem Re-Skin deaktiviert. ───── -->
  <link id="legacy-css" href="assets/application.css" media="screen" rel="stylesheet" type="text/css" />

  <!-- ───── jQuery + Original-Scripts (DOM bleibt 1:1) ───── -->
  <script src="assets/jquery.js"></script>
  <script src="assets/jquery_ujs.js"></script>
  <script src="assets/jquery.quickselect.min.js"></script>
  <script src="assets/string_score.min.js"></script>
  <script src="assets/application.js"></script>

  <!-- ───── Variant-Switcher: ?v=a|b|c   ?baseline=1 zeigt das Original ───── -->
  <script>
    (function () {
      var p = new URLSearchParams(location.search);
      var v = (p.get('v') || 'a').toLowerCase();
      if (!/^[abc]$/.test(v)) v = 'a';
      var baseline = p.get('baseline');
      var tokenMap = {
        a: 'redesign/tokens/variant-a-fairway-modern.css',
        b: 'redesign/tokens/variant-b-tour-pro-dark.css',
        c: 'redesign/tokens/variant-c-stat-lab-editorial.css'
      };
      function loadCss(href) {
        var l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = href;
        document.head.appendChild(l);
      }
      var cb = '?_=' + Date.now();
      if (baseline !== '1') {
        loadCss(tokenMap[v] + cb);
        loadCss('redesign/application.new.css' + cb);
      }
      window.__EGR_VARIANT = v.toUpperCase();
      window.__EGR_BASELINE = baseline === '1';
      window.addEventListener('DOMContentLoaded', function () {
        var legacy = document.getElementById('legacy-css');
        if (legacy && baseline !== '1') legacy.disabled = true;
        if (baseline !== '1') document.body.setAttribute('data-variant', v.toUpperCase());
      });
    })();
  </script>

  <!-- ───── Stufe-1-JS-Helfer (mit Cache-Buster) ───── -->
  <script>
    (function () {
      var s = document.createElement('script');
      s.src = 'redesign/application.new.js?_=' + Date.now();
      s.defer = true;
      document.head.appendChild(s);
    })();
  </script>
"""

SWITCHER_BLOCK = """
<!-- ════════════════ Preview-only Variant-Switcher ════════════════ -->
<style>
  .egr-preview-switcher {
    position: fixed; right: 16px; bottom: 16px; z-index: 2147483000;
    display: flex; flex-direction: column; gap: 6px;
    background: #0F1620; color: #fff;
    padding: 10px 12px; border-radius: 12px;
    font: 12px/1.3 -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
    box-shadow: 0 8px 28px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.08);
    max-width: 260px;
    pointer-events: auto;
  }
  .egr-preview-switcher * { box-sizing: border-box; }
  .egr-preview-switcher strong {
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
    opacity: .65; color: #fff;
  }
  .egr-preview-switcher .row { display: flex; gap: 4px; flex-wrap: wrap; }
  .egr-preview-switcher a {
    display: inline-block; padding: 6px 10px; border-radius: 6px;
    background: #1F2A37; color: #fff; text-decoration: none;
    font-weight: 600; font-size: 11px; transition: background .15s, transform .1s;
    border: 1px solid transparent; cursor: pointer;
  }
  .egr-preview-switcher a:hover { background: #2A3744; }
  .egr-preview-switcher a:active { transform: translateY(1px); }
  .egr-preview-switcher a.is-active {
    background: #2E7D32; border-color: #66BB6A; color: #fff;
  }
  /* Select: dunkel + opake Optionen, in jedem OS lesbar */
  .egr-preview-switcher select {
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    background-color: #1F2A37;
    background-image:
      linear-gradient(45deg, transparent 50%, #fff 50%),
      linear-gradient(135deg, #fff 50%, transparent 50%);
    background-position: calc(100% - 14px) 12px, calc(100% - 9px) 12px;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
    color: #fff !important;
    border: 1px solid #3B4A5A;
    padding: 6px 26px 6px 8px; border-radius: 6px;
    font: 600 11px/1.3 -apple-system, system-ui, sans-serif;
    width: 100%;
    cursor: pointer;
  }
  .egr-preview-switcher select:focus {
    outline: 2px solid #66BB6A; outline-offset: 1px;
  }
  /* Optionen: opaker dunkler Hintergrund, weisser Text — Chrome+Firefox+WebKit */
  .egr-preview-switcher select option {
    background: #1F2A37 !important;
    color: #fff !important;
  }
  .egr-preview-switcher select option:checked,
  .egr-preview-switcher select option:hover {
    background: #2E7D32 !important;
    color: #fff !important;
  }
  @media print { .egr-preview-switcher { display: none; } }
  @media (max-width: 480px) {
    .egr-preview-switcher { right: 8px; bottom: 8px; padding: 8px; max-width: 180px; }
  }
</style>
<aside class="egr-preview-switcher" id="egr-switcher" aria-label="Preview-Switcher" data-egr-noprint>
  <strong>Variant</strong>
  <div class="row" id="egr-switcher-variants"></div>
  <strong>Page</strong>
  <select id="egr-switcher-page"></select>
</aside>
<script>
  (function () {
    var variants = [['a','A · Fairway'], ['b','B · Tour Pro'], ['c','C · Stat-Lab'], ['baseline','Baseline']];
    var pages = __PAGES__;
    var p = new URLSearchParams(location.search);
    var current = (p.get('baseline') === '1') ? 'baseline' : (p.get('v') || 'a').toLowerCase();
    var thisFile = location.pathname.split('/').pop() || 'home.html';
    var rowVar = document.getElementById('egr-switcher-variants');
    variants.forEach(function (v) {
      var a = document.createElement('a');
      a.textContent = v[1];
      var url = thisFile;
      if (v[0] === 'baseline') url += '?baseline=1';
      else url += '?v=' + v[0];
      a.href = url;
      if (v[0] === current) a.className = 'is-active';
      rowVar.appendChild(a);
    });
    var sel = document.getElementById('egr-switcher-page');
    pages.forEach(function (pg) {
      var o = document.createElement('option');
      o.value = pg[0]; o.textContent = pg[1];
      if (pg[0] === thisFile) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', function () {
      var qs = (current === 'baseline') ? '?baseline=1' : '?v=' + current;
      location.href = sel.value + qs;
    });
  })();
</script>
"""

PAGE_LIST = [
    ("home.html",              "Home"),
    ("ranking.html",           "Rankings · Boys/Men"),
    ("ranking_women.html",     "Rankings · Girls/Women"),
    ("scandinavian_boys.html", "Scandinavian Boys"),
    ("scandinavian_girls.html","Scandinavian Girls"),
    ("dutch_jongens.html",     "Dutch · Jongens"),
    ("dutch_meisjes.html",     "Dutch · Meisjes"),
    ("events.html",            "Events"),
    ("how-to-use.html",        "How it Works"),
    ("about-us.html",          "About Us"),
    ("tours.html",             "Tours"),
    ("male.html",              "Male Overview"),
    ("female.html",            "Female Overview"),
    ("sign_in.html",           "Log In"),
    ("sign_up.html",           "Register"),
    ("contact.html",           "Contact"),
    ("imprint.html",           "Impressum"),
    ("privacy.html",           "Privacy"),
    ("terms.html",             "Terms of Use"),
    ("copyright.html",         "Copyright/Trademark"),
    ("search.html",            "Search Results"),
]

import json
PAGES_JSON = json.dumps(PAGE_LIST)


def rewrite_url(u: str) -> str:
    """Rewrite a single URL (href/src/action) to its preview equivalent."""
    if not u:
        return u
    # mailto, tel, javascript, fragment-only
    if u.startswith(("mailto:", "tel:", "javascript:", "#")):
        return u
    # Strip live host
    LIVE = "https://www.europeangolfrankings.com"
    if u.startswith(LIVE):
        u = u[len(LIVE):]
        if not u:
            u = "/"
    elif u.startswith("http://www.europeangolfrankings.com"):
        u = u[len("http://www.europeangolfrankings.com"):]
        if not u:
            u = "/"
    # Asset paths
    if u.startswith("/assets/"):
        return "assets/" + u[len("/assets/"):].lstrip("/")
    if u.startswith("/page_images/"):
        return "page_images/" + u[len("/page_images/"):]
    if u.startswith("/ads/"):
        return "ads/" + u[len("/ads/"):]
    if u.startswith("/profiles/"):
        # not mirrored — point to a placeholder
        return "assets/default.jpg"
    # Strip query string for matching
    base = u.split("?")[0].split("#")[0]
    if base in URL_MAP:
        suffix = u[len(base):]
        return URL_MAP[base] + suffix
    # Generic root-relative paths we don't have a page for → keep as # (dead link)
    if u.startswith("/players/") or u.startswith("/profiles/"):
        return "#"
    if u.startswith("/"):
        return "#"
    return u


# Regex to capture src=, href=, action= attributes
ATTR_RE = re.compile(r'\b(src|href|action)\s*=\s*(["\'])(.*?)\2', re.IGNORECASE)


def transform_html(html: str, page_kind: str, body_id_default: str) -> str:
    # 1) replace head — find first </head>
    head_end = re.search(r'</head\s*>', html, re.IGNORECASE)
    if not head_end:
        # No head — wrap minimal
        return NEW_HEAD + "</head>" + html
    body_part = html[head_end.end():]

    # 2) rewrite href/src/action
    body_part = ATTR_RE.sub(
        lambda m: f'{m.group(1)}={m.group(2)}{rewrite_url(m.group(3))}{m.group(2)}',
        body_part,
    )

    # 3) Strip Matomo tracker (it's external + tracks our preview)
    body_part = re.sub(
        r'<!--\s*Matomo\s*-->.*?<!--\s*End Matomo Code\s*-->',
        '', body_part, flags=re.DOTALL)

    # 3b) Strip <img> tags pointing at non-mirrored CMS uploads (page_images/...).
    #     These are 404 in the mirror; we hide them via CSS already, but the
    #     browser still issues a GET. Removing the element prevents the request.
    body_part = re.sub(
        r'<img[^>]*src=["\']page_images/[^"\']+["\'][^>]*/?>',
        '', body_part)
    # 3c) Strip the literal "?2026" cache-buster from ad src so GitHub Pages
    #     can serve the file (the literal `?` in the mirrored filename
    #     conflicts with the URL query separator).
    body_part = re.sub(
        r'(<img[^>]*src=["\']ads/[^"\']+\.gif)\?[^"\']+(["\'])',
        r'\1\2', body_part)
    # 3d) Mirror-Quirk: country flags live at /assets/X.png, but the HAML
    #     references them at /assets/flag/X.png. Rewrite directly so the
    #     browser doesn't issue 404s on first paint.
    body_part = re.sub(
        r'(src=["\'])assets/flag/', r'\1assets/', body_part)
    # 3e) Strip inline `style='background-image: url(/assets/top5-N.png)'`
    #     from .flagblock spans (female.html / male.html) — our CSS counters
    #     render the rank badges, the inline URL would only cause 404s.
    body_part = re.sub(
        r"\s*style=['\"]background-image:\s*url\(/assets/top5-\d+\.png\);?['\"]",
        '', body_part)

    # 4) Ensure body has data-egr-page attribute
    body_part = re.sub(
        r'<body([^>]*)>',
        lambda m: ensure_body_attrs(m.group(1), page_kind),
        body_part, count=1, flags=re.IGNORECASE,
    )

    # 5) Inject switcher at end of body
    pages_inline = SWITCHER_BLOCK.replace("__PAGES__", PAGES_JSON)
    body_part = re.sub(
        r'</body\s*>',
        lambda _m: pages_inline + "\n</body>",
        body_part, count=1, flags=re.IGNORECASE,
    )

    return NEW_HEAD + "</head>" + body_part


def ensure_body_attrs(existing: str, page_kind: str) -> str:
    has_id = re.search(r'\bid\s*=', existing, re.IGNORECASE)
    parts = existing
    if not has_id:
        parts += f' id="{page_kind}"'
    if 'data-egr-page' not in parts:
        parts += f' data-egr-page="{page_kind}"'
    return f"<body{parts}>"


def main() -> int:
    if not SRC.exists():
        print(f"ERR: source dir not found: {SRC}", file=sys.stderr)
        return 1
    DST.mkdir(parents=True, exist_ok=True)

    # Symlink assets / page_images / ads (idempotent)
    for name, src in [
        ("assets",      ASSETS_SRC),
        ("page_images", PAGE_IMAGES_SRC),
        ("ads",         ADS_SRC),
    ]:
        link = DST / name
        if not src.exists():
            continue
        if link.is_symlink() or link.exists():
            try:
                link.unlink()
            except IsADirectoryError:
                shutil.rmtree(link)
        link.symlink_to(os.path.relpath(src, DST))

    # Convert all subpages
    converted = 0
    for src_file in sorted(SRC.glob("*.html")):
        stem = src_file.stem
        page_kind = PAGE_KIND.get(stem, "pages")
        html = src_file.read_text(encoding="utf-8", errors="replace")
        out = transform_html(html, page_kind, body_id_default=page_kind)
        (DST / f"{stem}.html").write_text(out, encoding="utf-8")
        converted += 1
        print(f"  ✔ {stem}.html  (kind={page_kind})")

    # Make index.html → home.html
    home = DST / "home.html"
    if home.exists():
        idx = DST / "index.html"
        if idx.exists() or idx.is_symlink():
            idx.unlink()
        shutil.copyfile(home, idx)
        print(f"  ✔ index.html → home.html (copy)")

    print(f"\nDone: {converted} pages → {DST}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
