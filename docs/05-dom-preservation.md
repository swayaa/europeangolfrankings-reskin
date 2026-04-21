# DOM-Preservation — was darf NICHT verändert werden

> Diese Datei ist die kritischste Referenz für jeden, der CSS oder JS für den Re-Skin schreibt. Wer einen Selektor hier umbenennt, zerschießt den Rails-Output.

## Grundregel

> **Wir hängen unser CSS an die bestehende Klassen-/ID-Hierarchie. Wir benennen nichts um, fügen nichts in HAML hinzu (außer mit explizitem OK des Betreibers).**

Wenn wir neue Marker brauchen (z. B. „diese `<table>` ist die Ranking-Tabelle, nicht eine andere"), nutzen wir **Attribut-Selektoren** oder die **vorhandenen IDs**. Beispiel statt `[data-ranking="true"]` lieber `body#rankings table#table`.

## Kanonische Selektoren (Master-Liste)

### Layout-Wrapper
```css
body#rankings                                           /* Body der Ranking-Seite */
body#rankings_women                                     /* (vermutet, parallel) */
body#admin                                              /* Admin-Bereich, ignorieren */
div#contentbox                                          /* Outer 960-px-Wrapper */
div#main                                                /* Main-Layout-Bereich */
div#main div#inhalt                                     /* Inhalts-Container */
```

### Header & Navigation
```css
div#contentbox > header                                 /* Header */
div#contentbox > header h1                              /* Site-Title "European Golf Rankings" */
div#contentbox > header h1#tour                         /* Variante Tour-Pages */
div#contentbox > header img#logo                        /* Logo (assets/egr-logo-ohne.png) */
div#contentbox > header div#tourbanner                  /* Tour-Banner (nicht auf /ranking) */
div#contentbox > header > nav                           /* Hauptnav */
div#contentbox > header > nav > ul                      /* Hauptnav-Liste */
div#contentbox > header > nav > ul.rankings             /* Klasse pro Sektion (sehr wichtig) */
div#contentbox > header > nav > ul.events
div#contentbox > header > nav > ul.sessions
div#contentbox > header > nav > ul.pages
div#contentbox > header > nav > ul.tours
div#contentbox > header > nav > ul.countries
div#contentbox > header > nav > ul.clubs
div#contentbox > header > nav > ul.admin
div#contentbox > header > nav > ul.newstexts
div#contentbox > header > nav > ul.parents
div#contentbox > header > nav > ul li#l_home
div#contentbox > header > nav > ul li#l_rankings        /* aktiver Tab auf /ranking */
div#contentbox > header > nav > ul li#l_events
div#contentbox > header > nav > ul li#l_sessions        /* Login-Link */
div#contentbox > header > nav > ul li#l_admin
div#contentbox > header > nav > ul li#l_news
div#contentbox > header > nav > ul li#l_howtouse
div#contentbox > header > nav > ul li#l_aboutus
div#contentbox > header > nav > ul li#l_parentscorner
div#contentbox > header > nav > ul li#l_search          /* manchmal vorhanden */
div#contentbox > header > nav > ul li.last              /* letztes li */
div#contentbox > header > nav > ul li.active            /* aktiver Tab */
div#contentbox > header div#submenue                    /* Sub-Tab-Container */
div#contentbox > header div#submenue nav#submenue
div#contentbox > header div#submenue nav#submenue ul
div#contentbox > header div#submenue nav#submenue ul li
div#contentbox > header div#submenue nav#submenue ul li.active
div#contentbox > header div#submenue nav#submenue ul li.dropmenu
div#contentbox > header div#submenue nav#submenue ul li.dropmenu a.dropmenu
div#contentbox > header div#submenue nav#submenue ul li.dropmenu a.dropmenu.active
div#contentbox > header div#submenue nav#submenue ul li.dropmenu ul li.dropmenuitem
div#contentbox > header div#login_name                  /* nach Login sichtbar */
```

### Filter-Form
```css
div#searchbar                                           /* Container */
div#searchbar form                                      /* Form (action="/search" GET) */
div#searchbar form div.narrow                          /* Spalten-Wrapper */
div#searchbar form label
div#searchbar form input#last_name
div#searchbar form input#first_name
div#searchbar form select#country
div#searchbar form select#age_group
div#searchbar form select#gender
div#searchbar form input#open_closed                   /* hidden, "Both" */
div#searchbar form input[name="commit"]                /* Search-Button */
div#searchbar form input[type="hidden"][name="utf8"]   /* Rails CSRF-Helper */
```

### Ranking-Tabelle
```css
table#table                                             /* die Tabelle */
table#table tr.table_headfoot                           /* Header- & Footer-Zeile */
table#table tr.header                                   /* Spalten-Headers */
table#table tr.header.asc                               /* aktive Sortierrichtung */
table#table tr.header.desc
table#table tr.header th.points                         /* EGR Points */
table#table tr.header th.last_name                      /* Name */
table#table tr.header th.country
table#table tr.header th.born                           /* Age Group */
table#table tr.header th.score                          /* Avg. Score */
table#table tr.header th.css                            /* Avg. to CR */
table#table tr.header th.events                         /* Events Counting */
table#table tr.odd                                      /* Daten-Zeile odd */
table#table tr.even                                     /* Daten-Zeile even */
table#table tr.odd td, table#table tr.even td           /* Daten-Zellen */
table#table tr td a[href*="/players/"]                  /* Spieler-Detail-Link */
```

### Pagination
```css
div.pagination
div.pagination .previous_page
div.pagination .previous_page.disabled
div.pagination em.current
div.pagination .gap                                     /* "…" */
div.pagination a[rel="next"]
div.pagination a.next_page
```

### Sidebar (rechts)
```css
div#main aside                                          /* Sidebar */
div#main aside .page                                    /* Inhalts-Block */
div#main aside .page img                                /* Bild im Sidebar */
div#main aside .sidebar                                 /* Inhalts-Box */
div#main aside .sidebar h2                              /* Headline */
div#main aside .sidebar p
div#main aside .sidebar p.date
div#main aside .wblock                                  /* Werbung */
div#main aside .wblock img
div#main aside ul#bannerlist                            /* Admin-Banner-Liste */
div#main aside div.adminblock                          /* Admin-Hinweis */
```

### Footer
```css
div#contentbox > footer                                 /* Footer */
div#contentbox > footer nav
div#contentbox > footer nav ul
div#contentbox > footer nav ul li
div#contentbox > footer nav ul li.last
```

### Sonstiges (kommt auf anderen Sub-Pages vor, gut zu wissen)
```css
div#frontpage                                           /* Startseite */
div#event_details                                       /* Event-Detail */
div#event_details_head
div#player_head_details                                 /* Spieler-Detail-Header */
div.event_results
div.event_details
div.event_sigroups
table#tbv                                               /* spezielle Detail-Tabellen */
form#uploader_review                                   /* Admin-Uploader */
.quickselect_results                                    /* jquery.quickselect Dropdown */
.quickselect_loading
.quickselect_selected
#corner-banner                                          /* schräger Eck-Banner */
#pd_search_box                                          /* Player-Detail-Suche */
.border-shadow, .text-blue, .font-13, .font-bold        /* Utility-Klassen aus altem CSS */
```

## Was wir NEU setzen DÜRFEN (nur via CSS, kein DOM-Touch)

- **Custom Properties (`:root { --egr-color-*: …; }`)** — beliebig, kollidiert nicht.
- **Pseudo-Elemente (`::before`, `::after`)** — beliebig, z. B. für Country-Flags vor `td`.
- **`@media`-Queries** — beliebig, alte CSS hatte keine.
- **`@container`-Queries** — beliebig, mit Fallback.
- **`prefers-color-scheme`** — beliebig.
- **`scroll-margin-top`, `scroll-snap-*`** — beliebig.
- **CSS-Animationen** — beliebig (mit `prefers-reduced-motion`-Override).

## Was wir NICHT dürfen

- ❌ Element-Reihenfolge ändern (`<table>` vor `<form>` schieben etc.) — geht nur mit HAML-Edit.
- ❌ Klassen entfernen oder umbenennen (`.odd` → `.row-odd` zerschießt das gesamte alte CSS, falls es noch geladen wird).
- ❌ IDs neu vergeben.
- ❌ Inline-Styles im HAML überschreiben **ohne `!important`** — Rails-Output hat Inline-`width="70"`-Attribute auf `<td>`-Elementen. Wir müssen sie via `td[width]` und `width: auto !important` neutralisieren (siehe Variant-Specs).

## Inline-Style-Neutralisierung (kritisch!)

Die alten HAML-Templates schreiben fixe Pixel-Breiten direkt ins HTML:

```html
<td align='right' width='70'>54770.90</td>
<td align='left' width='200'><a href="...">BAKER, Eliot</a></td>
<td align='left' width='140'>England</td>
<td align='center' width='40'>Adult</td>
<td align='center' width='70'>69.54</td>
<td align='center' width='70'>66.77</td>
<td align='center' style='border-right: none;' width='60'>9</td>
```

**Pflicht im Reset-Block jeder Variante:**

```css
table#table td[width],
table#table th[width] {
  width: auto !important;
}
table#table td[align],
table#table th[align] {
  text-align: revert; /* wir setzen es per Spalten-Klasse neu */
}
```

Damit nehmen wir den HTML-Attributen die Wirkung weg und steuern alles via CSS.
