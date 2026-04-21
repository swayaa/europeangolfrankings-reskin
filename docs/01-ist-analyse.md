# Ist-Analyse — `europeangolfrankings.com/ranking`

> Stand: 2026-04-20, basierend auf dem lokalen Mirror in `mirror/www.europeangolfrankings.com/`.

## Tech-Stack der Live-Seite

| Schicht | Komponente | Indiz |
|---|---|---|
| Backend | Ruby on Rails (vermutlich Rails 3 / 4, Build ~ 2012–2014) | `csrf-token` Meta, auskommentierte HAML-Templates im Output (`- if pph[:open_closed] == "Both"`), Asset-Pipeline-URLs `?body=1` |
| Frontend | jQuery 1.x + jquery-ujs + `jquery.quickselect` + `string_score` | Eingebundene Script-Tags |
| Rendering | 100 % Server-Side, kein Ajax | Full-Page-Reload bei jedem Filter / Sort / Pagination |
| Tracking | Matomo (Piwik) self-hosted unter `pw.europeangolfrankings.com` | Footer-Script |
| Layout-Breite | **fixed 960 px** | `div#contentbox { width: 960px }` |
| Mobile | **nicht responsive** | Kein Viewport-Meta-Tag, kein Media-Query im CSS |
| IE-Support | IE 6–9 mit Fallback-CSS | `<!--[if IE 9]>`-Conditionals im `<head>` |

## Visuelles Erscheinungsbild

| Element | Wert |
|---|---|
| Body-Background | `#1B294C` mit `background2.jpg` cover |
| Content-Box | weiß, `box-shadow: 0 0 5px #000`, fixed 960 px |
| Header-Streifen | `deko6.jpg` repeat-x, 155 px Höhe |
| Nav-Bar Hauptmenü | `#274164` (Navy) mit `nav-bg.png` |
| Akzentfarbe Hover | `#FFCC00` (Gold) |
| Header-Schrift | Arial Bold, 36 px, `text-shadow: 2px 2px 2px #000` |
| Tabellen-Zeilen | `tr.odd` / `tr.even` Zebra |
| Sort-Pfeile | `dreieck-asc.png`, `dreieck-desc.png` (Pixel-PNGs) |
| Sidebar | grauer Block `#D9D9D9`, Header `#274161` |

## Datenstruktur

### Ranking-Tabelle

- **Männer:** 13 652 Spieler, 137 Seiten × 100, sortiert nach EGR Points absteigend
- **Frauen:** separate Seite `/ranking_women`
- **Sub-Rankings:** Scandinavian Boys/Girls, Dutch Jongens/Meisjes
- **Spalten:** EGR Points · Name (Last, First) · Country · Age Group · Avg. Score · Avg. to CR · Events Counting

### Filter-Optionen (alle GET-Parameter)

| Filter | Werte |
|---|---|
| `last_name` | Freitext |
| `first_name` | Freitext |
| `country` | All, Europe, 42 Einzel-Länder |
| `age_group` | All, U25, U25 & under, U23, U23 & under, U21, U21 & under, U18, U18 & under, U16, U16 & under, U14, U14 & under, U12 |
| `gender` | F / M / Both (Default M) |
| `sort` | points, last_name, country, born, score, css, events |
| `order` | ASC / DESC |
| `per_page` | 10, 25, 50, **100**, 200, **100000** (= alle) |
| `page` | 1 … 137 |

### Spieler-Detail

- **URL-Pattern:** `/players/{id}/Counting/All`
- **Beispiel aus Mirror:** `/players/29950/Counting/All` für „BAKER, Eliot"
- Wir haben den Detail-View **nicht** im Mirror — er ist aber für den Re-Skin nicht zwingend.

## Schmerzpunkte (= unsere Hebel)

| # | Schmerzpunkt | Auswirkung | Re-Skin-Lösung |
|---|---|---|---|
| 1 | Mobile komplett kaputt (960 px fixed) | Riesiger Anteil mobiler Nutzer surft horizontal | Container/Media-Queries, Table → Card unter 768 px |
| 2 | Lange Filter-Latenz (Full Page Reload) | Bei jedem Klick neu laden | Optionaler Stufe-2 JS: client-side Filter auf der „All"-Seite |
| 3 | Schwer lesbare Zahlen (Arial 11 px) | Datenkonsumenten kneifen die Augen | Tabular-numerals, größere Body-Schrift, klare Hierarchie |
| 4 | Sort-Pfeile als Pixel-PNGs | unscharf auf Retina | Inline-SVG aus Lucide |
| 5 | Keine Such-Hervorhebung | Filtertreffer schwer zu finden | Highlight-Markup via CSS `mark` |
| 6 | Kein Dark-Mode | – | `prefers-color-scheme` + Toggle |
| 7 | Keine Tastatur-Shortcuts | Power-User leiden | Optionaler Stufe-1 JS: `f` = Filter fokussieren, `n` = nächste Seite |
| 8 | Werbe-Sidebar drückt Layout | Inhalt wird auf 740 px gequetscht | Sidebar wird auf Mobile unter Tabelle verschoben, Tabelle bekommt volle Breite |
| 9 | Country-Spalte ist Plain-Text | Visueller Anker fehlt | Flag-Pill (Twemoji oder Country-Flag-Lib) + Ländername |
| 10 | Header-Hintergrund-JPG | 70 KB+ unkomprimiert | Wegfallen lassen oder durch CSS-Gradient ersetzen |

## Stabile DOM-Anker (NICHT verändern!)

Diese Selektoren liefert die Rails-App heute. Unser CSS hängt sich daran. Liste ist auch in `.cursor/rules/10-dom-preservation.mdc` (kürzer) und in `docs/05-dom-preservation.md` (ausführlich) hinterlegt.

| Selektor | Inhalt |
|---|---|
| `body#rankings` | Body der Ranking-Seite |
| `div#contentbox` | Outer Wrapper |
| `div#contentbox > header` | Header |
| `div#contentbox > header img#logo` | Logo |
| `div#contentbox > header > nav > ul.rankings` | Hauptnavigation, aktiver State `li#l_rankings` |
| `div#submenue nav#submenue` | Sub-Tabs (Boys/Men, Girls/Women, Scandinavian, Dutch) |
| `div#submenue li.dropmenu` | Dropdown (mit `:hover` JS) |
| `div#main` | Main-Layout-Wrapper |
| `div#main div#inhalt` | Inhalts-Container |
| `div#searchbar` | Filter-Formular |
| `div#searchbar form` | Form (Action: `/search` GET) |
| `div#searchbar select#country`, `select#age_group`, `select#gender` | Filter-Selects |
| `div#searchbar input#last_name`, `input#first_name` | Text-Filter |
| `div#searchbar input[name="commit"]` | Search-Button |
| `table#table` | Die Ranking-Tabelle |
| `table#table > tr.table_headfoot` | Header- und Footer-Zeile (mit Pagination) |
| `table#table > tr.header` | Spalten-Headers (sortierbar) |
| `table#table th.points/last_name/country/born/score/css/events` | Spalten-Header-Klassen |
| `table#table tr.odd`, `tr.even` | Daten-Zeilen Zebra |
| `table#table tr td a[href*="/players/"]` | Spieler-Detail-Links |
| `div.pagination` | Pagination |
| `div.pagination .previous_page`, `.next_page`, `.current`, `.gap` | Pagination-Klassen |
| `aside` | Sidebar (Werbung + sidebar-Box) |
| `aside .page` | Sidebar-Inhalts-Block |
| `aside .sidebar h2` | Sidebar-Headline |
| `aside .wblock` | Werbe-Banner-Box |
| `footer nav ul` | Footer-Navigation |

**Faustregel:** Wenn ein Selektor mit `#` (ID) anfängt und in der HAML-View existiert, ist er **kanonisch** und darf nur verwendet, nie umbenannt werden.
