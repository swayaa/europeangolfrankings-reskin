# Pitch-Deck — European Golf Rankings Re-Skin

> **Für deinen Freund zur Vorstellung beim Betreiber.**
> Drei Designvarianten, eine Drop-in-Implementierung, null Backend-Änderungen.

---

## TL;DR (eine Folie)

| Was er bekommt                          | Was er **nicht** ändern muss              |
| --------------------------------------- | ----------------------------------------- |
| 1 × `application.new.css` (~ 26 KB)     | Sein Rails-Backend                        |
| 1 × `application.new.js` (~ 4 KB)       | Seine HAML-Templates (DOM bleibt 1:1)     |
| 3 × `tokens/variant-*.css` (~ 8 KB ea.) | Seine Datenbank, sein Hosting, sein Cron  |
| 1 × `INTEGRATION.md` (5 Min Setup)      | Seine jQuery-Filter-Bar / Quickselect-JS  |

Einzige unvermeidbare HAML-Edit: ein `<meta name="viewport">` im Layout.
Alles andere ist reines Asset-Pipeline-Drop-in.

---

## Vorher / Nachher

### Desktop (1366 × 900) — Ranking-Ansicht

| Baseline (heute live) | Variant A — Fairway Modern | Variant B — Tour Pro Dark | Variant C — Stat-Lab Editorial |
| :---: | :---: | :---: | :---: |
| ![Baseline Desktop](screenshots/01-baseline-desktop.png) | ![Variant A Desktop](screenshots/02-variant-a-fairway-desktop.png) | ![Variant B Desktop](screenshots/03-variant-b-tour-pro-desktop.png) | ![Variant C Desktop](screenshots/04-variant-c-stat-lab-desktop.png) |
| 960 px fix · Hintergrundbild · 2010er Optik | Helle Sport-Optik · Grün-Akzent · Inter | Premium · Champagner-Gold · Glassmorphism | Editorial · Mono-Daten · Rot-Akzent |

### Mobile (390 × 844 — iPhone 14) — Ranking-Ansicht

| Baseline | Variant A | Variant B | Variant C |
| :---: | :---: | :---: | :---: |
| ![Baseline Mobile](screenshots/05-baseline-mobile.png) | ![Variant A Mobile](screenshots/06-variant-a-fairway-mobile.png) | ![Variant B Mobile](screenshots/07-variant-b-tour-pro-mobile.png) | ![Variant C Mobile](screenshots/08-variant-c-stat-lab-mobile.png) |
| **Horizontal-Scroll-Hölle** — 960 px Layout in 390 px Viewport | Karten-Layout · Daumen-freundlich | Karten-Layout · Top-3 mit Medaillen-Badges | Kompakte Liste · max. Dichte |

> **Argumentations-Anker:** Der erste Mobile-Screenshot ist der schlagkräftigste.
> Über 60 % seines Traffics ist mobil — und sieht heute genau so aus.

### Multi-Page-Konsistenz (Variant A · Desktop)

| Home (Frontpage) | Rankings | Events / How-it-Works / Sign-In |
| :---: | :---: | :---: |
| ![Home Variant A](screenshots/10-variant-a-home.png) | ![Ranking Variant A](screenshots/02-variant-a-fairway-desktop.png) | _siehe Live-Preview · alle 21 Subpages bedient_ |
| **Hero · 4 Quick-Stats · 3 Einstiegs-Karten · How-it-Works** | Sticky Subnav · luftige Filter-Karte · Dichte-Tabelle | Identische Header/Footer-Sprache · null Layout-Sprünge |

> **Home-Page wurde vollständig neu gestaltet** (Hero · Eyebrow · Title · Lead · 2 CTAs ·
> Quick-Stats · Section-Heading · 3 beschriftete Cards · "How it works"-3-Step-Block).
> Das geschieht ausschliesslich client-seitig per `application.new.js` und schreibt
> _kein_ HAML um — das Server-Rendering bleibt 1:1 wie heute.

#### Home in allen drei Varianten

| Variant A — Fairway Modern | Variant B — Tour Pro Dark | Variant C — Stat-Lab Editorial |
| :---: | :---: | :---: |
| ![Home A](screenshots/10-variant-a-home.png) | ![Home B](screenshots/11-variant-b-home.png) | ![Home C](screenshots/12-variant-c-home.png) |
| Hell · Grün-Akzent · sportlich | Dunkel-Navy · Champagner-Gold · premium | Cremepapier · Editorial-Rot · analytisch |

> Alle 21 Unterseiten (Rankings, Events, How-it-Works, Tours, About, Sign-In/-Up, Female/Male, Privacy, Terms, Imprint, Search …) erben dasselbe Token-Set.
> Eine Variante umstellen = alle Seiten umstellen, ohne dass irgendein Template angefasst wird.

#### Events-Tabelle in allen drei Varianten

| Variant A — Fairway Modern | Variant B — Tour Pro Dark | Variant C — Stat-Lab Editorial |
| :---: | :---: | :---: |
| ![Events A](screenshots/13-variant-a-events-table.png) | ![Events B](screenshots/14-variant-b-events-table.png) | ![Events C](screenshots/15-variant-c-events-table.png) |
| CAPS-Header · grüner Sort-Indikator · tabular Punkte | Dark-Theme · Champagner-Gold · Premium-Feel | Editorial-Layout · roter Sort-Indikator · Print-feel |

> Die Events-Liste wurde vom blauen Underline-Link-Salat zu einer richtigen
> Daten-Tabelle umgebaut: CAPS-Header, Sort-Pfeile, Zebra-Streifen, tabular-numerische
> Punkte rechts in Akzent-Farbe. Wieder ohne HAML-Anfassen — die Tabelle
> wird per JS in `id="table"` promoted, damit das vorhandene Tabellen-CSS greift.

#### Tours-Page (3-Spalten-Card-Grid)

| Variant A — Fairway Modern | Variant B — Tour Pro Dark |
| :---: | :---: |
| ![Tours A](screenshots/16-variant-a-tours.png) | ![Tours B](screenshots/17-variant-b-tours.png) |
| Helle Cards · grüne Initialen-Tiles · Foto-Cards mit Cover | Dunkle Cards · gold-akzentuierte Initialen-Tiles |

> Aus dem alten Float-Layout mit kaputten Bildern wurde ein modernes
> 3-Spalten-Grid mit gleichmäßiger Card-Höhe. Tours ohne Bild bekommen
> automatisch eine Initialen-Tile (z. B. "SC" für Scandinavian, "FS" für Faldo Series),
> Tours mit Bild zeigen das Foto via `object-fit: cover`.

#### Events-Sub-Tabs (Counting / Upcoming / Archive)

| Upcoming · Variant A | Upcoming · Variant B | Archive · Variant A | Archive · Variant C |
| :---: | :---: | :---: | :---: |
| ![Upcoming A](screenshots/18-events-upcoming-A.png) | ![Upcoming B](screenshots/19-events-upcoming-B.png) | ![Archive A](screenshots/20-events-archive-A.png) | ![Archive C](screenshots/21-events-archive-C.png) |

> Die Sub-Tabs **Counting / Upcoming / Archive** sind im HAML als Platzhalter
> (`href="#"`) hinterlegt. Wir verlinken sie clientseitig auf
> `events.html?filter=counting|upcoming|archive`, heben den aktiven Tab visuell
> hervor (Akzent-Farbe + Unterstrich) und filtern die Tabelle clientseitig
> nach Datum (Start ≥ heute → Upcoming, Ende < heute → Archive). Ein Filter-Banner
> über der Tabelle erklärt, was gerade gezeigt wird, mit "Filter aufheben"-Knopf.
> Im Live-Backend reicht es, die drei Filter serverseitig auf den Param zu mappen –
> der Front-End-Code bleibt dann unverändert.

---

## Argumente, in der Reihenfolge die wir empfehlen

### 1. Mobile Usability (heute praktisch nicht vorhanden)

- Ist: 960 px fixes Layout, Doppeltap zum Zoomen, horizontal scrollen.
- Nach Re-Skin: Vollwertige Karten-Ansicht mit allen Daten, ohne dass HAML angefasst wird.
- Messbar: Lighthouse Mobile Score von ~ 40 → > 90, Tap-Target-Failures auf 0.

### 2. Visueller Vertrauensvorschuss

- Ist: 2010er Web-1.0-Optik (Hintergrund-JPG, Text-Shadows, gerasterte Buttons).
- Nach Re-Skin: Aktuelle Designsprache, drei distinkte Charaktere zur Auswahl.
- Wirkung: Nutzer trauen den Daten heute spontan weniger als sie sollten.

### 3. Zugänglichkeit (DSGVO-/BFSG-relevant ab 2025)

- Ist: Keine ARIA-Sort-Hinweise, schwache Tastatur-Bedienung, keine Reduced-Motion-Unterstützung.
- Nach Re-Skin: WCAG 2.1 AA, `aria-sort`-Auto-Injection per JS, Skip-Link, Tastatur-Shortcuts (`/`, `n`, `p`), `prefers-reduced-motion`, `forced-colors`.

### 4. Performance & Bandbreite

- Ist: Hintergrund-JPEG (~ 600 KB) auf jeder Seite, kein Caching der Header-Images.
- Nach Re-Skin: Reine CSS-Gradients, keine Bilder im Header (Logo bleibt), Datei-Größen siehe TL;DR.

### 5. Risikoarmes Rollout

- Beide Stylesheet-Sets können koexistieren. Switch via Manifest-Zeile (`stylesheet_link_tag`).
- Rollback in 30 Sekunden.
- Keine Build-Tools, kein npm, kein Webpack — passt zu jedem Sprockets/Propshaft-Setup.

---

## Drei Varianten — wann passt welche?

| Kriterium                       | A — Fairway Modern        | B — Tour Pro Dark            | C — Stat-Lab Editorial      |
| ------------------------------- | ------------------------- | ---------------------------- | --------------------------- |
| **Stimmung**                    | Sportlich, freundlich     | Premium, professionell        | Datengetrieben, präzise     |
| **Zielgruppe (gefühlt)**        | Gelegenheits-Fans, Eltern | Sponsoren, Spieler-Profile   | Coaches, Statistik-Nerds    |
| **Erstes Aha**                  | Lesbarkeit                | "Das wirkt teuer"            | "Endlich klare Zahlen"      |
| **Risiko**                      | Niedrig — generisch sport | Mittel — Dark als Default    | Mittel — Mono-Font polarisiert |
| **Casual-Mobile-Erstkontakt**   | ★★★                       | ★★                           | ★★                          |
| **Brand-Aufwertung**            | ★★                        | ★★★                          | ★★                          |
| **Empfehlung**                  | **Sicherer Default**      | Wenn Branding aufgewertet werden soll | Wenn das Datenargument zentral ist |

---

## Frequently asked questions (vorbereitet für deinen Freund)

**„Müssen wir den ganzen Code austauschen?"**
Nein. Eine CSS-Datei und (optional) eine JS-Datei werden hinzugefügt, die alte CSS wird in derselben Manifest-Zeile ersetzt. Das HTML/HAML-Markup bleibt unverändert.

**„Was passiert mit unserem jQuery-Filter und Quickselect?"**
Bleiben unangetastet. Die neuen Stylesheets erkennen die existierenden DOM-Selektoren wie `#searchbar`, `table#table`, `.pagination` und stylen sie passend. Quickselect funktioniert weiter, wirkt nur moderner.

**„Wie lange dauert der Einbau?"**
Etwa 5–10 Minuten Asset-Drop-in plus eine 1-zeilige HAML-Änderung (Viewport-Meta-Tag). Siehe `redesign/INTEGRATION.md`.

**„Können wir später noch zwischen Varianten wechseln?"**
Ja. Die drei Token-Dateien sind unabhängig; durch Tausch einer einzigen Zeile im Manifest wird die ganze Site umgestellt — ohne irgendeinen Cache zu invalidieren, der über eigene Assets hinausgeht.

**„Was kostet uns das langfristig?"**
Genau einen zusätzlichen Stylesheet-Request (~ 26 KB gzipped < 8 KB). Keine externen CDN-Abhängigkeiten, keine npm-Pakete, keine Tracking-Scripts.

**„Was, wenn wir Anpassungen wollen?"**
Alle Farb-, Schrift- und Spacing-Werte sind in den Token-Dateien als CSS Custom Properties (`--egr-*`) zentralisiert. Eine Änderung an einer Stelle wirkt überall — keine Suche nach Hex-Werten in 1.000 Selektoren.

---

## Live-Preview lokal ausführen

```bash
cd preview
python3 -m http.server 4711
```

Dann im Browser:

| URL                                                       | Anzeige                                |
| --------------------------------------------------------- | -------------------------------------- |
| `http://localhost:4711/?baseline=1`                       | Original (heute live)                  |
| `http://localhost:4711/?v=a`                              | Variant A — Fairway (Home)             |
| `http://localhost:4711/ranking.html?v=a`                  | Variant A — Rankings                   |
| `http://localhost:4711/events.html?v=b`                   | Variant B — Events                     |
| `http://localhost:4711/how-to-use.html?v=c`               | Variant C — How it Works               |
| `http://localhost:4711/sign_in.html?v=a`                  | Variant A — Login (DOM-only Demo)      |
| `http://localhost:4711/mobile.html?v=b&p=ranking.html`    | Mobile-Mockup (390 px) für jede Subpage|

Unten rechts ist ein Switcher-Widget mit **allen 21 Subpages** und allen 4 Varianten (A/B/C + Baseline) zum direkten Vergleich. Die Variante bleibt beim Klicken durch die Navigation erhalten (`preserveVariant`-Helper im JS).

> **Preview neu bauen** (nach Token- oder CSS-Änderungen):
> `python3 tools/build_preview.py`

---

## Nächste Schritte (für die Pitch-Diskussion)

1. **Variante festlegen** — A, B oder C. Variant A und C sind bewusst helle Themes (kein Auto-Dark), Variant B ist permanent dunkel. Damit bleibt die Markenidentität stabil — egal welches Betriebssystem-Theme der Nutzer eingestellt hat.
2. **Logo-Export** — die bestehende Logo-PNG wird in einem runden Brand-Ring (variant-spezifisch grün/gold/rot) eingefasst. Falls eine SVG-Variante existiert, drop-in austauschbar.
3. **Font-Hosting entscheiden** — Self-Hosted (DSGVO-sicher, ~ 60 KB WOFF2) **oder** System-Fonts (0 KB, leichter Stilverlust). Beide Pfade sind dokumentiert.
4. **Roll-out auf Staging-Subdomain** zuerst (z. B. `staging.europeangolfrankings.com`), dann nach 24 h Monitoring auf Produktion.
5. **Optional Phase 2:** dezente JS-Erweiterungen (Live-Filter ohne Reload, Spalten-Konfigurator, Spieler-Vergleich). Nicht Bestandteil dieses Pitches.

---

## Anhang: Was im Lieferumfang ist

```
redesign/
├── application.new.css                  ← Komponenten-CSS (~ 26 KB)
├── application.new.js                   ← Optionale JS-Helfer (~ 4 KB)
├── tokens/
│   ├── variant-a-fairway-modern.css     ← Eine davon einbinden
│   ├── variant-b-tour-pro-dark.css
│   └── variant-c-stat-lab-editorial.css
└── INTEGRATION.md                       ← 5-Minuten-Setup-Guide
```

Begleitende Dokumentation:

- `docs/00-tech-stack-global.md` — globale technische Strategie
- `docs/01-ist-analyse.md` — Bestandsanalyse
- `docs/02-soll-zustand.md` — Ziele & Erfolgskriterien
- `docs/05-dom-preservation.md` — welche Selektoren wir nicht anfassen
- `docs/06-rails-integration.md` — Rails-spezifische Schritte
- `docs/design-systems/variant-{a,b,c}.md` — Spezifikationen pro Variante
- `canvases/egr-design-systems-comparison.canvas.tsx` — interaktiver Variant-Vergleich
