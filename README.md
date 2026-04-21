# European Golf Rankings — Re-Skin-Projekt

> **Ziel:** Das visuelle Erscheinungsbild von `europeangolfrankings.com` modernisieren — als Drop-in-CSS für die bestehende Ruby-on-Rails-App. Kein Rebuild, kein neuer Tech-Stack, kein Mehraufwand für den Betreiber.

## Schnell-Orientierung

| Wenn du … | … schau in … |
|---|---|
| **Pitch beim Betreiber** vorbereiten willst (TL;DR + Screenshots) | `docs/04-pitch-deck.md` |
| die **Live-Multi-Page-Preview** sehen willst | `python3 -m http.server 4711 --directory preview` → `localhost:4711/?v=a` (Switcher unten rechts hat Page-Dropdown mit allen 21 Seiten) |
| die **Mobile-Mockup-Demo** sehen willst | `localhost:4711/mobile.html?v=a&p=ranking.html` |
| die **Design-System-Vergleichs-Canvas** öffnen willst | `canvases/egr-design-systems-comparison.canvas.tsx` |
| die **Preview neu bauen** willst (z. B. nach CSS-Änderung an `application.new.css`) | `python3 tools/build_preview.py` |
| den **aktuellen Zustand** der Live-Seite verstehen willst | `docs/01-ist-analyse.md` |
| die **Soll-Ziele** und Pitch-Argumente brauchst | `docs/02-soll-zustand.md` |
| die **3 Design-Varianten** vergleichen willst | `docs/design-systems/variant-{a,b,c}.md` |
| das **technische Lieferpaket** verstehen willst | `docs/00-tech-stack-global.md` |
| **CSS schreibst** und nicht weisst, was du ändern darfst | `docs/05-dom-preservation.md` |
| dem **Betreiber** das Paket übergibst | `redesign/INTEGRATION.md` |
| **CSS-Tokens** kopieren möchtest | `redesign/tokens/variant-*.css` |

## Projektstruktur

```
.
├── README.md                             # ← du bist hier
├── ARCHIV-HINWEIS.txt                    # Originale Mirror-Anleitung
├── download-vollstaendig.sh              # Re-Mirror-Skript (lokal ausführen)
├── ranking-inhaltssnapshot.md            # Erster Inhalts-Snapshot
│
├── mirror/                               # Live-Snapshot (Read-Only-Referenz)
│   └── www.europeangolfrankings.com/
│       ├── ranking.html                  # echte gerenderte Seite
│       └── assets/                       # Original-CSS, JS, Bilder
│
├── docs/
│   ├── 00-tech-stack-global.md           # Tech-Stack aller Varianten
│   ├── 01-ist-analyse.md                 # was läuft heute, wie?
│   ├── 02-soll-zustand.md                # was muss am Ende anders sein?
│   ├── 05-dom-preservation.md            # was DARF nicht angefasst werden
│   ├── 06-rails-integration.md           # interne Doku zur Rails-Integration
│   ├── design-systems/
│   │   ├── variant-a-fairway-modern.md
│   │   ├── variant-b-tour-pro-dark.md
│   │   └── variant-c-stat-lab-editorial.md
│   └── design-mockups/                   # Screenshots Pitch-Material
│
├── redesign/
│   ├── tokens/                           # Drop-in Custom-Properties pro Variante
│   │   ├── variant-a-fairway-modern.css
│   │   ├── variant-b-tour-pro-dark.css
│   │   └── variant-c-stat-lab-editorial.css
│   ├── application.new.css               # finale Drop-in-CSS (importiert eine Token-Datei)
│   ├── application.new.js                # optionale JS-Helfer
│   ├── fonts/                            # .woff2-Files
│   └── INTEGRATION.md                    # ← das, was der Betreiber bekommt
│
├── preview/                              # lokale Live-Preview (python3 -m http.server)
│   ├── index.html                        # Home (Klon home.html) mit Switcher
│   ├── ranking.html, events.html, …      # alle 21 Subpages, gebaut aus mirror/_subpages
│   ├── mobile.html                       # Mobile-Mockup im 390-px-Iframe (mit Page-Dropdown)
│   ├── assets/                           # Symlink → mirror/assets
│   ├── page_images/                      # Symlink → mirror/page_images
│   └── redesign/                         # Symlink → /redesign  (immer aktuell!)
│
├── tools/
│   └── build_preview.py                  # baut preview/*.html aus mirror/_subpages
│
├── canvases/
│   └── egr-design-systems-comparison.canvas.tsx   # interaktiver Vergleich
│
└── .cursor/
    ├── rules/                            # always-on Regeln für KI-Sub-Agents
    │   ├── 00-project-context.mdc
    │   ├── 10-dom-preservation.mdc
    │   ├── 20-design-systems.mdc
    │   ├── 30-responsive-rules.mdc
    │   ├── 40-rails-integration.mdc
    │   └── 50-accessibility.mdc
    └── skills/                           # Operations-Anleitungen für Sub-Agents
        ├── preview-mirror/SKILL.md
        ├── swap-css/SKILL.md
        └── visual-diff/SKILL.md
```

## Die drei Design-Varianten — One-Liner

| Variante | One-Liner | Akzent |
|---|---|---|
| **A — Fairway Modern** | Helles, sportliches Data-Cockpit für Trainer und Eltern | Wald-Grün `#2E7D32` |
| **B — Tour Pro Dark** | Premium-Leaderboard mit Champagner-Gold auf Navy | Gold `#D4AF37` |
| **C — Stat-Lab Editorial** | Bloomberg-Style Mono-Tabelle für Daten-Power-User | Karmin `#E63946` |

Vollständige Specs in `docs/design-systems/`.

## Token-Architektur

Zwei Schichten von CSS Custom Properties:

1. **Variant-Prefix-Tokens** (`--fw-*`, `--tp-*`, `--sl-*`) — Brand-spezifische Rohwerte, leben in `redesign/tokens/variant-X.css`.
2. **Semantische Aliasse** (`--egr-*`) — werden im Bottom-Block jeder Variant-Token-Datei gemappt; **nur diese** werden in `application.new.css` referenziert.

Folge: Eine einzige Komponenten-CSS-Datei (`application.new.css`) funktioniert mit jeder Variante. Wechsel zwischen Varianten bedeutet, **eine** Token-Datei zu tauschen, nicht den ganzen Stylesheet.

Details: `.cursor/rules/20-design-systems.mdc`.

## Workflow

### Live-Preview für den Kollegen
```bash
python3 -m http.server 4711 --directory preview
```

Die Switcher-Toolbar unten rechts hat **zwei** Auswahlboxen:
- **Variant** (A · Fairway / B · Tour Pro / C · Stat-Lab / Baseline)
- **Page** (Dropdown mit allen 21 Unterseiten)

Direkte URLs:

| URL | Anzeige |
|---|---|
| `http://localhost:4711/?baseline=1` | Original (heute live, ohne Re-Skin) |
| `http://localhost:4711/?v=a` | Home — Variant A |
| `http://localhost:4711/ranking.html?v=a` | Ranking — Variant A |
| `http://localhost:4711/ranking.html?v=b` | Ranking — Variant B |
| `http://localhost:4711/ranking.html?v=c` | Ranking — Variant C |
| `http://localhost:4711/events.html?v=a` | Events |
| `http://localhost:4711/sign_in.html?v=a` | Login |
| `http://localhost:4711/how-to-use.html?v=a` | How it Works + About Us |
| `http://localhost:4711/mobile.html?v=a&p=ranking.html` | Mobile-Mockup im 390-px-Frame |

Beim Navigieren zwischen Seiten bleibt die Variante automatisch erhalten (`preserveVariant()` in `application.new.js`).

### Preview neu bauen
Nach Änderung an einer Subpage im Mirror oder am Token-/CSS-Setup:

```bash
python3 tools/build_preview.py
```

Das Script konvertiert `mirror/www.europeangolfrankings.com/_subpages/*.html` in preview-fähige Dateien (mit Switcher, korrekten Asset-Pfaden, `data-egr-page`-Hooks). Änderungen an `redesign/application.new.css` werden **nicht** durch dieses Script beeinflusst — sie werden direkt aus dem Symlink `preview/redesign/` ausgeliefert.

### Übergabe an Betreiber
- `redesign/`-Ordner zippen (CSS + JS + Tokens)
- `redesign/INTEGRATION.md` als zentrale Anleitung mitsenden
- `docs/04-pitch-deck.md` als Argumentations-Hilfe
- `docs/design-systems/variant-X.md` der gewählten Variante als technische Referenz

## Mess-Ziele

- Lighthouse Performance ≥ 90 (mobile)
- Lighthouse Accessibility ≥ 95
- LCP < 1,2 s
- CSS-Bundle < 25 KB (gzipped < 8 KB)
- Mobile-tauglich auf 375 px (heute: nicht)
- Setup-Aufwand für Betreiber: < 10 Min

## Status

| Phase | Status |
|---|---|
| Ist-Analyse | ✅ |
| 3 Design-Specs | ✅ |
| 3 Token-CSS-Files (mit `--egr-*` Mappings) | ✅ |
| `application.new.css` (Komponenten-CSS, multi-page-fähig) | ✅ |
| `application.new.js` (JS-Helfer + Variant-Persistenz) | ✅ |
| Header/Banner/Logo redesigned (alle 3 Varianten) | ✅ |
| Responsive (Desktop / Tablet / Mobile, ohne Layout-Shift bei Zoom) | ✅ |
| Preview-Builder `tools/build_preview.py` | ✅ |
| Alle 21 Unterseiten im Preview (mit Page-Dropdown) | ✅ |
| `mobile.html` mit Variant- und Page-Auswahl | ✅ |
| Cross-page/cross-variant Smoke-Tests | ✅ |
| Theme-Identität fixiert (A/C bleiben hell, B bleibt dunkel — kein Auto-Dark) | ✅ |
| Home-Page Re-Design (Hero · Quick-Stats · 3 beschriftete Cards · How-it-works) | ✅ |
| Variant-Switcher klickbar (Bug "preserveVariant frisst eigenen Switcher") | ✅ |
| Page-Dropdown lesbar (dunkler Hintergrund + weisse Text) | ✅ |
| Frontpage-Grid symmetrisch (3 Cols ab 640 px, 1 Col darunter — kein 2 + 1) | ✅ |
| Events-Tabelle stylisch (CAPS-Header · Sort-Pfeile · Zebra · tabular Punkte) | ✅ |
| Tours-Page als 3-Spalten-Card-Grid (Initialen-Tile bei fehlendem Bild) | ✅ |
| Events-Sub-Tabs Counting / Upcoming / Archive verlinkt + clientseitig gefiltert | ✅ |
| Home: Mittlere Karte (Europa-Map) zeigt auf "How it Works" (= Original-Verhalten, vom Betreiber bestätigt) | ✅ |
| Sign-In/Sign-Up: Checkbox-Label horizontal + nicht mehr in CAPS (`form p:has(input[type=checkbox])`) | ✅ |
| Wide-Tables: `div.egr-table-wrap` mit sichtbarem Scrollbar (Webkit + Firefox) statt abgeschnittener Spalten | ✅ |
| Events-Sub-Nav: Doppel-Active-Bug ("Current Year" + Filter gleichzeitig hervorgehoben) gefixt | ✅ |
| Ultra-Debug-Sweep: 0 Console-Errors · 0 404s · alle 21 Pages × 3 Varianten + Baseline geprüft | ✅ |
| Rankings-Submenue: Scandinavian/Dutch-Dropdown wird vom Filter-Card nicht mehr verdeckt (`<header>` bekommt eigenen Stacking-Context, `#searchbar` z-index gesenkt, CSS-`:hover`-Fallback ergänzt) | ✅ |
| Rankings-Submenue: Dropdown schließt jetzt zuverlässig beim Mouse-Leave (eigener `rewireDropmenu()`-Handler in `application.new.js` ersetzt den klemmenden jQuery-`toggle()`-Handler, plus 180 ms Schonfrist + Klick-außerhalb + ESC zum Schließen) | ✅ |
| Pitch-Screenshots (Baseline + 3×2 + Home/Events/Tours in 3 Varianten) | ✅ |
| `docs/04-pitch-deck.md` | ✅ |
| Design-System-Vergleichs-Canvas | ✅ |
| `INTEGRATION.md` | ✅ |
| `.cursor/`-Regelwerk | ✅ |
| Variant-Wahl durch Betreiber | ⏳ |
| Roll-out auf Staging | ⏳ |
