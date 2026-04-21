/* ============================================================================
 * European Golf Rankings — Re-Skin
 * application.new.js  ·  Stufe-1 JS-Helfer (~ 4 KB)
 *
 * Was er macht:
 *  1. Skip-Link "Zum Ranking springen" am Body-Anfang einfügen
 *  2. Viewport-Meta-Tag injizieren, falls nicht im HAML vorhanden
 *  3. aria-sort an die Sortier-Spalten setzen (basierend auf .asc/.desc Klassen)
 *  4. data-age + data-country an td-Elementen für Mobile-Card-Pseudo-Labels
 *  5. Tabellen-Caption injizieren (für Screenreader)
 *  6. Country-Flag-Hooks (vorbereitet, aktiv nur wenn Variante es vorsieht)
 *
 * Defensiv geschrieben: jede Funktion prüft ihre eigenen Voraussetzungen,
 * stürzt nie das Original-jQuery-Setup ab.
 *
 * Namespacing: window.EGRReskin
 * ============================================================================ */

(function () {
  'use strict';

  // Wenn schon initialisiert, abbrechen
  if (window.EGRReskin) return;
  window.EGRReskin = {};

  /* --------------------------------------------------------------------------
   * 1. Viewport-Meta-Tag (falls fehlt)
   * Ohne ihn ist alle Mobile-Arbeit wirkungslos.
   * -------------------------------------------------------------------------- */
  function ensureViewport() {
    if (document.querySelector('meta[name="viewport"]')) return;
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1');
    var head = document.querySelector('head');
    if (head) head.insertBefore(meta, head.firstChild);
  }

  /* --------------------------------------------------------------------------
   * 2. Skip-Link "Zum Ranking springen"
   * -------------------------------------------------------------------------- */
  function ensureSkipLink() {
    if (document.querySelector('.egr-skiplink')) return;
    var table = document.getElementById('table');
    if (!table) return;
    if (!table.id) table.id = 'table';
    var skip = document.createElement('a');
    skip.className = 'egr-skiplink';
    skip.href = '#table';
    skip.textContent = 'Zum Ranking springen';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* --------------------------------------------------------------------------
   * 3. aria-sort an Sortier-Spalten
   * -------------------------------------------------------------------------- */
  function syncAriaSort() {
    var headerRow = document.querySelector('table#table tr.header');
    if (!headerRow) return;

    var direction = headerRow.classList.contains('asc') ? 'ascending'
                  : headerRow.classList.contains('desc') ? 'descending'
                  : 'none';

    var ths = headerRow.querySelectorAll('th');
    ths.forEach(function (th) {
      // Aktive Spalte = die mit dem Pfeil-Element / passender Klasse
      // Fallback: erste Spalte (points) als Default-Sort
      th.setAttribute('role', 'columnheader');
      th.setAttribute('aria-sort', 'none');
    });

    // Default-Sort der Live-Site ist points DESC
    var pointsTh = headerRow.querySelector('th.points');
    if (pointsTh) pointsTh.setAttribute('aria-sort', direction);
  }

  /* --------------------------------------------------------------------------
   * 4. data-age + data-country auf td-Elementen
   * Erlaubt CSS-Pseudo-Labels und spätere Country-Flag-Hooks.
   * -------------------------------------------------------------------------- */
  function decorateRows() {
    var rows = document.querySelectorAll('table#table tr.odd, table#table tr.even');
    rows.forEach(function (tr) {
      var tds = tr.children;
      if (tds.length < 7) return;
      // td:nth-child(3) = Country, td:nth-child(4) = Age Group
      var countryTd = tds[2];
      var ageTd     = tds[3];
      var country   = (countryTd.textContent || '').trim();
      var age       = (ageTd.textContent || '').trim();
      if (country) countryTd.setAttribute('data-country', country);
      if (age)     countryTd.setAttribute('data-age', age);
    });
  }

  /* --------------------------------------------------------------------------
   * 5. Tabellen-Caption (für Screenreader)
   * -------------------------------------------------------------------------- */
  function ensureCaption() {
    var table = document.getElementById('table');
    if (!table) return;
    if (table.querySelector('caption')) return;
    var caption = document.createElement('caption');
    caption.textContent = 'European Golf Rankings — Spielerübersicht';
    caption.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
    table.insertBefore(caption, table.firstChild);
  }

  /* --------------------------------------------------------------------------
   * 6. Variant-Marker am body (für CSS-Hooks wie Top-3-Badges)
   * Quelle: data-variant Attribute am body, oder body[data-variant]
   * Default: keiner.
   * -------------------------------------------------------------------------- */
  function syncBodyVariant() {
    var b = document.body;
    if (!b) return;
    if (b.hasAttribute('data-variant')) return;
    // optional: aus URL-Param ?v=a|b|c lesen
    var params = new URLSearchParams(location.search);
    var v = params.get('v');
    if (v === 'a' || v === 'b' || v === 'c') {
      b.setAttribute('data-variant', v.toUpperCase());
    }
  }

  /* --------------------------------------------------------------------------
   * 7. Sticky-Filter-Bar Backdrop-Indicator
   * Beim Scrollen kriegt #searchbar eine Klasse, damit CSS einen sanften
   * Schatten/Border einblenden kann.
   * -------------------------------------------------------------------------- */
  function attachStickyShadow() {
    var bar = document.getElementById('searchbar');
    if (!bar) return;
    // Nutzt einen Sentinel direkt über der Bar
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'height:1px;margin:0;padding:0;';
    sentinel.setAttribute('aria-hidden', 'true');
    bar.parentNode.insertBefore(sentinel, bar);
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        bar.classList.toggle('is-stuck', e.intersectionRatio === 0);
      });
    }, { threshold: [0, 1] });
    io.observe(sentinel);
  }

  /* --------------------------------------------------------------------------
   * 7b. Variant-Persistenz: Hängt ?v=X (oder ?baseline=1) an alle internen
   *     <a>-href, sodass beim Page-Wechsel die Variante erhalten bleibt.
   *     Wird NUR im Preview-Kontext aktiv (Pfade enden auf .html).
   * -------------------------------------------------------------------------- */
  function preserveVariant() {
    var p = new URLSearchParams(location.search);
    var variantQs;
    if (p.get('baseline') === '1') variantQs = 'baseline=1';
    else if (p.get('v')) variantQs = 'v=' + p.get('v');
    else return;

    var anchors = document.querySelectorAll('a[href]');
    anchors.forEach(function (a) {
      // Niemals Links innerhalb des Preview-Switchers anfassen
      // (sonst killen wir die Variant-Knöpfe und Baseline-Knopf!)
      if (a.closest && a.closest('.egr-preview-switcher')) return;
      // Opt-out per Attribut für jeden anderen Link
      if (a.hasAttribute('data-egr-skip-preserve')) return;
      var href = a.getAttribute('href');
      if (!href) return;
      // Skip externe Links, mailto, tel, javascript, fragments, dropdown-trigger
      if (/^(https?:|mailto:|tel:|javascript:|#)/.test(href)) return;
      if (a.hasAttribute('target') && a.getAttribute('target') === '_blank') return;
      // Nur .html-Dateien oder root-Pfade behandeln
      if (!/\.html(\?|#|$)/.test(href) && href !== '/' && href !== '#') return;
      // Existierende Query strippen, neue setzen (variantQs hat Vorrang)
      var url, hash = '';
      var hashIdx = href.indexOf('#');
      if (hashIdx >= 0) {
        hash = href.substring(hashIdx);
        href = href.substring(0, hashIdx);
      }
      var qIdx = href.indexOf('?');
      var path = qIdx >= 0 ? href.substring(0, qIdx) : href;
      var existing = qIdx >= 0 ? href.substring(qIdx + 1) : '';
      // Existierende v= / baseline= entfernen
      var parts = existing.split('&').filter(function (x) {
        return x && !/^v=/.test(x) && !/^baseline=/.test(x);
      });
      parts.unshift(variantQs);
      a.setAttribute('href', path + '?' + parts.join('&') + hash);
    });
  }

  /* --------------------------------------------------------------------------
   * 8. Tastatur-Shortcuts (sehr leichtgewichtig)
   *    /  oder  f   → Last-Name-Filter fokussieren
   *    n           → nächste Seite
   *    p           → vorherige Seite
   * -------------------------------------------------------------------------- */
  function attachShortcuts() {
    document.addEventListener('keydown', function (e) {
      // Wenn schon in einem Input → ignorieren
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        return;
      }
      var k = e.key;
      if (k === '/' || k === 'f') {
        e.preventDefault();
        var ln = document.getElementById('last_name');
        if (ln) ln.focus();
      } else if (k === 'n') {
        var next = document.querySelector('a.next_page, a[rel="next"]');
        if (next) { e.preventDefault(); window.location.href = next.href; }
      } else if (k === 'p') {
        var prev = document.querySelector('a.previous_page:not(.disabled)');
        if (prev) { e.preventDefault(); window.location.href = prev.href; }
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 8a. Events-Filter — verlinkt die Sub-Nav-Tabs (Counting / Upcoming /
   *     Archive) auf events.html mit Filter-Param, hebt aktiven Tab hervor
   *     und filtert die Tabelle clientseitig nach Datum.
   *
   *     Mappings:
   *       ?filter=counting → alle Events des laufenden Jahres (= Default)
   *       ?filter=upcoming → nur Events deren Start-Datum >= heute
   *       ?filter=archive  → nur Events deren End-Datum   <  heute
   * -------------------------------------------------------------------------- */
  var MONTHS = {
    jan:  0, januar: 0, january: 0,
    feb:  1, februar: 1, february: 1,
    mar:  2, mär: 2, marz: 2, märz: 2, march: 2,
    apr:  3, april: 3,
    may:  4, mai: 4,
    jun:  5, juni: 5, june: 5,
    jul:  6, juli: 6, july: 6,
    aug:  7, august: 7,
    sep:  8, sept: 8, september: 8,
    oct:  9, okt: 9, october: 9, oktober: 9,
    nov: 10, november: 10,
    dec: 11, dez: 11, december: 11, dezember: 11
  };
  function parseShortDate(text, year) {
    if (!text) return null;
    // Erwartet "3. Jan", "12. Jan", "31. Dez"
    var m = text.trim().match(/^(\d{1,2})\.\s*([A-Za-zÄäÖöÜüß]+)/);
    if (!m) return null;
    var day = parseInt(m[1], 10);
    var mon = MONTHS[m[2].toLowerCase()];
    if (mon == null || isNaN(day)) return null;
    return new Date(year, mon, day);
  }
  function getEventsFilter() {
    var qs = window.location.search;
    var hash = window.location.hash;
    var m = qs.match(/[?&]filter=([a-z]+)/i) || hash.match(/#filter=([a-z]+)/i)
         || hash.match(/^#(counting|upcoming|archive)$/i);
    return m ? m[1].toLowerCase() : null;
  }
  function rewireEventsSubnav() {
    // Sub-Nav-Tabs Counting/Upcoming/Archive auf echten Filter-Param umlinken,
    // egal auf welcher Seite der User gerade ist.
    var pairs = [
      [/^counting$/i,  'events.html?filter=counting'],
      [/^upcoming$/i,  'events.html?filter=upcoming'],
      [/^archive$/i,   'events.html?filter=archive'],
      [/^current\s*year$/i, 'events.html']
    ];
    var anchors = document.querySelectorAll('#submenue a, ul.events a, ul.tours a');
    anchors.forEach(function (a) {
      var label = (a.textContent || '').trim();
      pairs.forEach(function (p) {
        if (p[0].test(label)) {
          var href = a.getAttribute('href');
          if (!href || href === '#' || href.indexOf('events.html') !== -1) {
            a.setAttribute('href', p[1]);
          }
        }
      });
    });
  }
  function highlightActiveEventsTab(filter) {
    var anchors = document.querySelectorAll('#submenue a');
    // Erst alle bestehenden Active-States entfernen — die HAML-Vorlage setzt
    // standardmäßig `<li class="active">` auf "Current Year", was sich sonst
    // mit unserem Filter-Highlight überlagert.
    anchors.forEach(function (a) {
      a.removeAttribute('aria-current');
      if (a.parentNode && a.parentNode.classList) {
        a.parentNode.classList.remove('active');
      }
    });
    anchors.forEach(function (a) {
      var label = (a.textContent || '').trim().toLowerCase();
      var match = false;
      if (filter === 'counting' && label === 'counting') match = true;
      if (filter === 'upcoming' && label === 'upcoming') match = true;
      if (filter === 'archive'  && label === 'archive')  match = true;
      if (!filter && /current\s*year/.test(label)) match = true;
      if (match) {
        a.setAttribute('aria-current', 'page');
        a.parentNode && a.parentNode.classList.add('active');
      }
    });
  }
  function injectEventsFilterBanner(filter, counts) {
    if (!filter) return;
    var inhalt = document.querySelector('#inhalt');
    if (!inhalt || inhalt.querySelector('.egr-filter-banner')) return;
    var titles = {
      counting: 'Counting toward ranking',
      upcoming: 'Upcoming events',
      archive:  'Archive — past events'
    };
    var subtitles = {
      counting: 'Alle Events des laufenden Jahres, deren Punkte aktuell ins Ranking einfließen.',
      upcoming: 'Events, die noch nicht gestartet sind. Punkte sind als Schätzung auf Basis der Vorjahresergebnisse ausgewiesen.',
      archive:  'Bereits abgeschlossene Events des laufenden Jahres mit finalen Punkten.'
    };
    var banner = document.createElement('div');
    banner.className = 'egr-filter-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML =
      '<div class="egr-filter-banner__inner">' +
        '<span class="egr-filter-banner__chip">Filter</span>' +
        '<div class="egr-filter-banner__text">' +
          '<strong>' + titles[filter] + '</strong>' +
          '<span class="egr-filter-banner__sub">' + subtitles[filter] +
            (counts ? ' · <em>' + counts.shown + ' von ' + counts.total + ' Einträgen</em>' : '') +
          '</span>' +
        '</div>' +
        '<a class="egr-filter-banner__reset" href="events.html">Filter aufheben ✕</a>' +
      '</div>';
    var heading = inhalt.querySelector('h2');
    if (heading && heading.parentNode) {
      heading.parentNode.insertBefore(banner, heading.nextSibling);
    } else {
      inhalt.insertBefore(banner, inhalt.firstChild);
    }
  }
  function applyEventsFilter() {
    var body = document.body;
    if (!body || body.id !== 'events') return;
    rewireEventsSubnav();
    var filter = getEventsFilter();
    highlightActiveEventsTab(filter);
    if (!filter || filter === 'counting') {
      // Counting + (kein Filter) zeigen die volle Liste
      injectEventsFilterBanner(filter, null);
      return;
    }
    // Datum-basiert filtern
    var yearSelect = document.querySelector('select[name="year"], select#year');
    var year = yearSelect && parseInt(yearSelect.value, 10) ||
               new Date().getFullYear();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var table = document.querySelector('#table[data-egr-table="events"]');
    if (!table) { injectEventsFilterBanner(filter, null); return; }
    var rows = table.querySelectorAll('tr.odd, tr.even');
    var shown = 0, total = rows.length;
    rows.forEach(function (row) {
      var cells = row.querySelectorAll('td');
      if (cells.length < 2) return;
      var startStr = cells[0].textContent;
      var endStr   = cells[1].textContent;
      var start = parseShortDate(startStr, year);
      var end   = parseShortDate(endStr,   year);
      if (!start || !end) return;
      var keep = true;
      if (filter === 'upcoming') keep = (start.getTime() >= today.getTime());
      if (filter === 'archive')  keep = (end.getTime()   <  today.getTime());
      if (keep) {
        shown++;
        row.style.removeProperty('display');
      } else {
        row.style.display = 'none';
      }
    });
    injectEventsFilterBanner(filter, { shown: shown, total: total });
    // Pagination-Footer ausblenden, da clientseitig gefiltert
    var foots = table.querySelectorAll('tr.table_headfoot');
    foots.forEach(function (tr, idx) {
      if (idx > 0) tr.style.display = 'none';
    });
    // Empty-State injizieren wenn 0 Treffer
    if (shown === 0) {
      var tbody = table.querySelector('tbody') || table;
      if (!table.querySelector('.egr-empty-row')) {
        var emptyRow = document.createElement('tr');
        emptyRow.className = 'egr-empty-row';
        var td = document.createElement('td');
        td.colSpan = 6;
        td.innerHTML =
          '<div class="egr-empty-state">' +
            '<strong>Keine Treffer auf dieser Seite.</strong>' +
            '<span>Der statische Vorschau-Mirror enthält nur die erste Ergebnisseite. ' +
            'Auf der Live-Site würden hier alle ' +
            (filter === 'upcoming' ? 'noch ausstehenden' : 'archivierten') +
            ' Events des Jahres ' + year + ' erscheinen.</span>' +
          '</div>';
        emptyRow.appendChild(td);
        // hinter dem Header einfügen
        var headerRow = table.querySelector('tr.header');
        if (headerRow && headerRow.parentNode) {
          headerRow.parentNode.insertBefore(emptyRow, headerRow.nextSibling);
        } else {
          tbody.appendChild(emptyRow);
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
   * 8b. Promote the first <table> inside #inhalt to id="table" if it has no id.
   *     Damit greift das gesamte styled-table-CSS (Header, Zebra, Hover)
   *     auch auf der Events-Seite, ohne dass das HAML angefasst werden muss.
   * -------------------------------------------------------------------------- */
  function wrapTablesScrollable() {
    // Tabellen im #inhalt mit einem horizontal-scrollenden Wrapper versehen,
    // damit auf schmalen Viewports kein Spalten-Inhalt abgeschnitten wird.
    var inhalt = document.querySelector('#inhalt');
    if (!inhalt) return;
    var tables = inhalt.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) {
      var t = tables[i];
      if (!t.querySelector('th')) continue; // nur Daten-Tabellen
      var parent = t.parentNode;
      if (parent && parent.classList && parent.classList.contains('egr-table-wrap')) continue;
      var wrap = document.createElement('div');
      wrap.className = 'egr-table-wrap';
      wrap.setAttribute('data-egr-wrap', 'table');
      parent.insertBefore(wrap, t);
      wrap.appendChild(t);
    }
    document.documentElement.setAttribute('data-egr-wraps', String(tables.length));
  }

  function promoteTableId() {
    var inhalt = document.querySelector('#inhalt');
    if (!inhalt) return;
    var tables = inhalt.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) {
      var t = tables[i];
      if (!t.querySelector('th')) continue; // nur Daten-Tabellen
      // Tabellen-Typ anhand erster <th>-Klasse erkennen
      var firstTh = t.querySelector('th');
      var cls = firstTh ? firstTh.className : '';
      var kind = 'generic';
      if (/points|last_name/.test(cls))   kind = 'rankings';
      else if (/date_start/.test(cls))    kind = 'events';
      t.setAttribute('data-egr-table', kind);
      if (!t.id) {
        t.id = 'table';
        t.setAttribute('data-egr-promoted', '1');
      }
      break;
    }
  }

  /* --------------------------------------------------------------------------
   * 8c. Tours-Page: float-Layout in modernes Card-Grid umwandeln.
   *     Original-DOM: .tours-Heading + multiple
   *       <div style='float: left; text-align: center;'>
   *         <a><img src="#"></a><br><a>Name</a>
   *       </div>
   *     Wir wrappen alle Float-Divs in einen .egr-tours-grid Container und
   *     setzen pro Card .egr-tour-card mit Bild-Status (has-image / no-image).
   * -------------------------------------------------------------------------- */
  function decorateToursPage() {
    var inhalt = document.querySelector('#inhalt');
    if (!inhalt) return;
    var heading = inhalt.querySelector('h2.tours');
    if (!heading) return;
    var floatCards = inhalt.querySelectorAll("div[style*='float: left'], div[style*='float:left']");
    if (!floatCards.length) return;
    if (inhalt.querySelector('.egr-tours-grid')) return; // schon gemacht

    var grid = document.createElement('div');
    grid.className = 'egr-tours-grid';
    floatCards[0].parentNode.insertBefore(grid, floatCards[0]);

    floatCards.forEach(function (card) {
      card.removeAttribute('style');
      card.classList.add('egr-tour-card');

      var img = card.querySelector('img');
      var imgSrc = img && img.getAttribute('src');
      var hasValidImage = imgSrc && imgSrc !== '#' && imgSrc.trim() !== '';
      card.setAttribute('data-has-image', hasValidImage ? '1' : '0');

      // Sichtbaren Link-Text ermitteln (zweites <a>, das Tour-Name enthält)
      var anchors = card.querySelectorAll('a');
      var nameAnchor = anchors[anchors.length - 1];
      var name = (nameAnchor && nameAnchor.textContent || '').trim();

      // Falls kein Bild: Initialen-Tile statt broken <img>
      if (!hasValidImage && img) {
        var words = name.split(/\s+/).filter(Boolean);
        var initials;
        if (words.length >= 2) {
          initials = words.slice(0, 2)
            .map(function (w) { return w.charAt(0).toUpperCase(); })
            .join('');
        } else if (words.length === 1) {
          initials = words[0].slice(0, 2).toUpperCase();
        } else {
          initials = '·';
        }
        var tile = document.createElement('span');
        tile.className = 'egr-tour-tile';
        tile.setAttribute('aria-hidden', 'true');
        tile.textContent = initials || '·';
        img.parentNode.replaceChild(tile, img);
      }
      grid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
   * 9. Home-Hero: macht aus den drei rohen Frontpage-Bildern eine echte
   *    Landing-Page mit Eyebrow, Titel, Lead, CTAs, Stats, Labels und
   *    einem "How it works" Mini-Block. Alles innerhalb der bestehenden
   *    DOM-Struktur (#inhalt) — Server-Rendering bleibt unangetastet.
   * -------------------------------------------------------------------------- */
  function buildHomeHero() {
    if (!document.body) return;
    if (document.body.getAttribute('data-egr-page') !== 'home') return;
    var inhalt = document.querySelector('#inhalt');
    if (!inhalt) return;
    if (inhalt.querySelector('.egr-hero')) return; // schon gebaut

    // 9a. Hero
    var hero = document.createElement('section');
    hero.className = 'egr-hero';
    hero.setAttribute('aria-labelledby', 'egr-hero-title');
    hero.innerHTML =
      '<div class="egr-hero__inner">' +
        '<p class="egr-hero__eyebrow">Independent · Pan-European · Live</p>' +
        '<h2 id="egr-hero-title" class="egr-hero__title">' +
          'Track every shot.<br><span>Across every tour.</span>' +
        '</h2>' +
        '<p class="egr-hero__lead">' +
          'Live points, age-group ladders and event counts for thousands of amateur and junior golfers across more than 40 federations.' +
        '</p>' +
        '<div class="egr-hero__ctas">' +
          '<a class="egr-cta egr-cta--primary" href="ranking.html">Browse Rankings <span aria-hidden="true">→</span></a>' +
          '<a class="egr-cta egr-cta--ghost" href="events.html">Latest Events</a>' +
        '</div>' +
        '<dl class="egr-hero__stats" role="list">' +
          '<div role="listitem"><dt>Players ranked</dt><dd>13,652</dd></div>' +
          '<div role="listitem"><dt>Federations</dt><dd>40+</dd></div>' +
          '<div role="listitem"><dt>Events / season</dt><dd>1,300+</dd></div>' +
          '<div role="listitem"><dt>Updates</dt><dd>Live</dd></div>' +
        '</dl>' +
      '</div>';
    inhalt.insertBefore(hero, inhalt.firstChild);

    // 9b. Frontpage-Cards beschriften
    var fp = inhalt.querySelector('#frontpage');
    if (fp) {
      // Section-Heading darüber
      var fpHeading = document.createElement('h3');
      fpHeading.className = 'egr-section-title';
      fpHeading.textContent = 'Choose your ranking';
      fp.parentNode.insertBefore(fpHeading, fp);

      var children = fp.children;
      var labels = [
        { eyebrow: "Women's & Girls'", title: 'Female Rankings',  desc: 'From U12 to Open · all federations',         href: 'female.html'  },
        { eyebrow: 'Across Europe',    title: 'How it Works',     desc: 'Scoring system, field strength & federation rules', href: 'how-to-use.html' },
        { eyebrow: "Men's & Boys'",    title: 'Male Rankings',    desc: 'From U12 to Open · all federations',         href: 'male.html'    }
      ];
      for (var i = 0; i < children.length && i < 3; i++) {
        var card = children[i];
        // Bestehende <a>-Wraps auf das gewünschte Ziel umbiegen, damit
        // Card-Bild + Card-Label-Link immer auf die richtige Seite zeigen.
        var anchors = card.querySelectorAll('a[href]');
        anchors.forEach(function (a) {
          a.setAttribute('href', labels[i].href);
        });
        if (card.querySelector('.egr-card-label')) continue;
        var label = document.createElement('div');
        label.className = 'egr-card-label';
        label.innerHTML =
          '<span class="egr-card-label__eyebrow">' + labels[i].eyebrow + '</span>' +
          '<strong class="egr-card-label__title">' + labels[i].title + '</strong>' +
          '<span class="egr-card-label__desc">' + labels[i].desc + '</span>';
        card.appendChild(label);
      }
    }

    // 9c. How-it-works Mini-Section
    var hiw = document.createElement('section');
    hiw.className = 'egr-hiw';
    hiw.setAttribute('aria-labelledby', 'egr-hiw-title');
    hiw.innerHTML =
      '<header class="egr-hiw__head">' +
        '<h3 id="egr-hiw-title" class="egr-section-title">How it works</h3>' +
        '<a class="egr-hiw__more" href="how-to-use.html">Read the full method <span aria-hidden="true">→</span></a>' +
      '</header>' +
      '<ol class="egr-hiw__steps">' +
        '<li>' +
          '<span class="egr-hiw__num">1</span>' +
          '<strong>Tournaments report results</strong>' +
          '<span>National federations and tour organisers send official scorecards as soon as a round is signed.</span>' +
        '</li>' +
        '<li>' +
          '<span class="egr-hiw__num">2</span>' +
          '<strong>Points are calculated</strong>' +
          '<span>Field strength, course rating and average score determine each player\'s points for that event.</span>' +
        '</li>' +
        '<li>' +
          '<span class="egr-hiw__num">3</span>' +
          '<strong>Rankings update live</strong>' +
          '<span>Players see their position across age groups and federations the moment new scores land.</span>' +
        '</li>' +
      '</ol>';
    if (fp && fp.parentNode) {
      fp.parentNode.insertBefore(hiw, fp.nextSibling);
    } else {
      inhalt.appendChild(hiw);
    }
  }

  /* --------------------------------------------------------------------------
   * Init
   * -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
   * 12. Submenue-Dropdown (Scandinavian / Dutch)
   *
   * Original-Verhalten: jQuery-Inline-Script ruft `$(this).find('ul').toggle()`
   * im `.hover()`-Handler auf. Das ist fragil — `toggle()` flippt einfach
   * zwischen display:block/none und kann „klemmen", wenn jQuery nicht (oder
   * doppelt) lädt oder wenn Maus-Events durch das absolute-positionierte
   * Dropdown nicht sauber ankommen. Resultat: Dropdown blieb manchmal offen.
   *
   * Hier setzen wir einen sauberen Vanilla-Handler obendrauf:
   *  - mouseenter auf li.dropmenu  → ul.style.display = 'block'
   *  - mouseleave auf li.dropmenu  → kurzer Delay (200 ms), damit man rüber
   *    kann, dann ul.style.display = 'none'
   *  - Klick irgendwo sonst        → alle Dropdowns schließen
   *  - ESC                         → alle Dropdowns schließen
   *
   * Wir entfernen NICHT das Original-Script — wir überschreiben nur den
   * Inline-Style, was hart genug ist, um den toggle-State zu dominieren.
   * -------------------------------------------------------------------------- */
  function rewireDropmenu() {
    var dropmenus = document.querySelectorAll('div#submenue li.dropmenu');
    if (!dropmenus.length) return;

    var openTimers = new WeakMap();

    function open(li) {
      var ul = li.querySelector(':scope > ul');
      if (!ul) return;
      var t = openTimers.get(li);
      if (t) { clearTimeout(t); openTimers.delete(li); }
      ul.style.display = 'block';
      var trigger = li.querySelector(':scope > a.dropmenu');
      if (trigger) trigger.classList.add('active');
    }

    function close(li) {
      var ul = li.querySelector(':scope > ul');
      if (!ul) return;
      ul.style.display = 'none';
      var trigger = li.querySelector(':scope > a.dropmenu');
      if (trigger) trigger.classList.remove('active');
    }

    function closeAll(except) {
      for (var i = 0; i < dropmenus.length; i++) {
        if (dropmenus[i] !== except) close(dropmenus[i]);
      }
    }

    for (var i = 0; i < dropmenus.length; i++) {
      (function (li) {
        li.addEventListener('mouseenter', function () {
          closeAll(li);
          open(li);
        });
        li.addEventListener('mouseleave', function () {
          // Kurze Schonfrist, damit Mausbewegungen am Rand nicht
          // sofort schließen.
          var t = setTimeout(function () { close(li); }, 180);
          openTimers.set(li, t);
        });
        // Tastatur-Fokus: öffnen wenn Trigger oder Item Fokus hat
        li.addEventListener('focusin',  function () { open(li); });
        li.addEventListener('focusout', function (e) {
          if (!li.contains(e.relatedTarget)) close(li);
        });
      })(dropmenus[i]);
    }

    // Klick außerhalb → alle schließen
    document.addEventListener('click', function (e) {
      var target = e.target;
      var inside = false;
      for (var i = 0; i < dropmenus.length; i++) {
        if (dropmenus[i].contains(target)) { inside = true; break; }
      }
      if (!inside) closeAll(null);
    });

    // ESC → alle schließen
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  // tours.html: das Original-Rails-Layout hängt aus Versehen die Rankings-
  // Sub-Nav (Boys/Men · Girls/Women · Scandinavian · Dutch) an die Tours-
  // Seite. Konzeptionell gehört Tours unter Events. Wir tauschen die Sub-
  // Nav clientseitig gegen die Events-Sub-Nav mit "Tours" als Active-Tab.
  function fixToursSubnav() {
    var body = document.body;
    if (!body || body.id !== 'tours') return;
    var nav = document.querySelector('div#submenue nav#submenue');
    if (!nav) return;
    // Heuristik: enthält die Sub-Nav den Boys/Men-Link, ist sie die falsche.
    if (!nav.querySelector('a[href="ranking.html"]')) return;
    nav.innerHTML =
      '<ul>' +
        '<li><a href="events.html">Current Year</a></li>' +
        '<li><a href="events.html?filter=counting">Counting</a></li>' +
        '<li><a href="events.html?filter=upcoming">Upcoming</a></li>' +
        '<li><a href="events.html?filter=archive">Archive</a></li>' +
        '<li class="active"><a href="tours.html" aria-current="page">Tours</a></li>' +
      '</ul>';
  }

  // Mirror-Quirk: das Original liefert Flaggen über die Asset-Pipeline aus
  // `assets/flag/<land>.png`, der gespiegelte Pfad ist aber `assets/<land>.png`.
  // Wir normalisieren clientseitig, damit wir die Original-HAML nicht anfassen.
  function fixFlagPaths() {
    var imgs = document.querySelectorAll('img[src*="assets/flag/"]');
    for (var i = 0; i < imgs.length; i++) {
      var src = imgs[i].getAttribute('src') || '';
      imgs[i].setAttribute('src', src.replace('assets/flag/', 'assets/'));
    }
  }

  // Top-5-Übersicht (`female.html`/`male.html`): das Original benutzt
  // `<span class="flagblock" style="background-image: url(/assets/top5-N.png)">`
  // mit absolutem Slash, der unter GitHub Pages auf der Domain-Root landet
  // (404). Wir entfernen das Inline-Background und setzen ein data-Attribut,
  // damit unser CSS via `:nth-child` die Rang-Badges 1–5 selbst rendern kann.
  function decorateTop5() {
    var lists = document.querySelectorAll('div.top5_nations ul');
    if (!lists.length) return;
    for (var i = 0; i < lists.length; i++) {
      var items = lists[i].querySelectorAll(':scope > li');
      for (var j = 0; j < items.length; j++) {
        var rank = j + 1;
        items[j].setAttribute('data-rank', String(rank));
        var fb = items[j].querySelector('.flagblock');
        if (fb && fb.style && fb.style.backgroundImage) {
          fb.style.backgroundImage = 'none';
        }
      }
    }
  }

  function init() {
    try { ensureViewport(); }     catch (e) {}
    try { syncBodyVariant(); }    catch (e) {}
    try { ensureSkipLink(); }     catch (e) {}
    try { wrapTablesScrollable(); } catch (e) {}
    try { promoteTableId(); }     catch (e) {} // muss vor caption/sort/rows laufen
    try { ensureCaption(); }      catch (e) {}
    try { syncAriaSort(); }       catch (e) {}
    try { decorateRows(); }       catch (e) {}
    try { attachStickyShadow(); } catch (e) {}
    try { decorateToursPage(); }  catch (e) {}
    try { applyEventsFilter(); }  catch (e) {}
    try { buildHomeHero(); }      catch (e) {}
    try { fixToursSubnav(); }     catch (e) {}
    try { fixFlagPaths(); }       catch (e) {}
    try { decorateTop5(); }       catch (e) {}
    try { preserveVariant(); }    catch (e) {}
    try { attachShortcuts(); }    catch (e) {}
    try { rewireDropmenu(); }     catch (e) {}
  }

  // API für externe Re-Init (nach Filter-Reload)
  window.EGRReskin.init = init;
  window.EGRReskin.decorateRows = decorateRows;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
