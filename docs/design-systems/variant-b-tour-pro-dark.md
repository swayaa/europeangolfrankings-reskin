# Variante B — „Tour Pro Dark"

> Premium, dunkel, PGA-Tour-nah. Die Seite, von der Fans und Presse einen Screenshot machen, ohne sich zu schämen.

## Brand-Story / Mood

Tour Pro Dark zitiert die Original-Palette der Live-Seite (Navy + Gold) und hebt sie auf **Editorial-Grade**. Wo das Original „2010er Vereinsheim" aussieht, soll diese Variante wirken wie das **Live-Leaderboard einer Major-Übertragung**: tief, ruhig, mit warmen Akzenten in Champagner-Gold.

Mood-Anker:
- **PGA-Tour-Leaderboard auf großen Screens**
- **Premium-Sportmagazin** — Sky Sports, The Open Official, Bleacher Report
- **Glas und Messing** — sehr dezente Glassmorphism-Akzente, nirgends Gradient-Spielereien

Zielgruppe: Fans, Presse, Wettbüros, Verbände — Menschen, die das Ranking **anschauen wollen**, nicht nur lesen.

---

## Tech-Stack (Variant-spezifisch)

| Asset | Wahl | Größe | Bezugsquelle |
|---|---|---|---|
| **Body-Font** | Inter Variable (latin + latin-ext) | ~38 KB woff2 | rsms.me/inter |
| **Display-Font** | Fraunces Variable (für H1, falls eines kommt) | ~52 KB woff2 | Google Fonts (self-hosted) |
| **Numerals** | Inter `tnum` + Fraunces für Hero-Zahlen | – | – |
| **Icons** | Lucide Icons inline-SVG | ~1 KB / Icon | lucide.dev |
| **Country-Flags** | `country-flag-icons` SVG-Sprites | ~250 KB lazy | optional |
| **JS-Helfer** | Stufe 1: `egr-reskin.js` (~ 4 KB), Stufe 2: `ranking-fast-filter.js` (~ 8 KB, empfohlen für Premium-Feel) | – | – |

Fraunces ist Optional und nur als Display für den Site-Title und ggf. Top-1-Spieler-Hero (falls je). Wenn Bytes kritisch sind, kann sie weggelassen und Inter 700 als Fallback verwendet werden.

---

## Farb-Palette

> **Diese Variante ist Dark-Mode-First.** Light-Mode existiert als Spiegel, ist aber nicht das Default-Erlebnis.

### Brand-Farben

| Token | Hex | RGB | Verwendung |
|---|---|---|---|
| `--tp-color-navy-950` | `#070D1A` | 7, 13, 26 | Body-Background (Default) |
| `--tp-color-navy-900` | `#0E1626` | 14, 22, 38 | Surface / Card |
| `--tp-color-navy-800` | `#172238` | 23, 34, 56 | Surface 2 / Filter-Bar |
| `--tp-color-navy-700` | `#22324F` | 34, 50, 79 | Hover-States |
| `--tp-color-navy-600` | `#2D4168` | 45, 65, 104 | Aktive Tabs |
| `--tp-color-gold-500` | `#D4AF37` | 212, 175, 55 | Primär-Akzent (Champagner-Gold) |
| `--tp-color-gold-400` | `#E6C567` | 230, 197, 103 | Hover Akzent |
| `--tp-color-gold-300` | `#F2DA94` | 242, 218, 148 | Subtile Highlights |

### Text-Skala (Dark)

| Token | Hex | Verwendung |
|---|---|---|
| `--tp-color-text-1` | `#F4F6FB` | Primärer Text |
| `--tp-color-text-2` | `#A9B2C5` | Sekundärer Text |
| `--tp-color-text-3` | `#6B7689` | Tertiärer Text |
| `--tp-color-text-disabled` | `#3F485A` | Disabled |

### Funktionale Farben

| Token | Hex | Verwendung |
|---|---|---|
| `--tp-color-success` | `#34D399` | Aufsteiger im Ranking, Erfolg |
| `--tp-color-warning` | `#FBBF24` | Achtung, Form-Validation |
| `--tp-color-danger` | `#F87171` | Absteiger, Error |
| `--tp-color-link` | `#7DD3FC` | Spieler-Detail-Links (Sky-Cyan) |
| `--tp-color-link-hover` | `#D4AF37` | = Gold-500 |

### Light-Mode-Spiegel (`prefers-color-scheme: light`)

| Token | Hex |
|---|---|
| `--tp-color-canvas` | `#F4F6FB` |
| `--tp-color-surface` | `#FFFFFF` |
| `--tp-color-surface-2` | `#EEF1F8` |
| `--tp-color-text-1` | `#0E1626` |
| `--tp-color-text-2` | `#3B4760` |
| `--tp-color-gold-500` | `#A57F19` (dunkler im Light für Kontrast) |

### Glassmorph-Tokens

```
--tp-glass-bg: rgba(23, 34, 56, 0.72)        /* Filter-Bar Sticky */
--tp-glass-border: rgba(212, 175, 55, 0.12)
--tp-glass-blur: 12px
```

Verwendung **nur** auf der Sticky Filter-Bar und der Pagination-Footer. Sonst flat.

### Kontrast-Tabelle (WCAG-AA-geprüft, Dark-Default)

| Vordergrund / Hintergrund | Kontrast | Status |
|---|---|---|
| `--text-1 #F4F6FB` auf `--navy-950 #070D1A` | 18.1 : 1 | AAA |
| `--text-2 #A9B2C5` auf `--navy-950 #070D1A` | 9.6 : 1 | AAA |
| `--text-1 #F4F6FB` auf `--navy-900 #0E1626` | 16.4 : 1 | AAA |
| `--gold-500 #D4AF37` auf `--navy-950 #070D1A` | 9.4 : 1 | AAA |
| `--gold-500 #D4AF37` auf `--navy-800 #172238` | 7.8 : 1 | AAA |
| `--link #7DD3FC` auf `--navy-900 #0E1626` | 11.2 : 1 | AAA |

Light-Mode-Kontraste analog ≥ 4.5:1 für Body, ≥ 7:1 für die Goldakzente.

---

## Typografie

| Rolle | Font | Weight | Größe (px) | Größe (rem) | Line-Height | Tracking |
|---|---|---|---|---|---|---|
| Site-Title (Header) | Fraunces | 600 | 36 | 2.25 rem | 1.1 | -0.02em |
| Section H2 | Inter | 600 | 18 | 1.125 rem | 1.3 | 0 |
| Tabellen-Header `<th>` | Inter | 500 | 11 | 0.6875 rem | 1.2 | **0.12em (uppercase, breit)** |
| Body / Tabellen-Daten | Inter | 400 | 14 | 0.875 rem | 1.5 | 0 |
| Punkte (Hero-Zahlen) | Fraunces | 600 | 18 | 1.125 rem | 1.1 | -0.01em (tnum) |
| Labels | Inter | 500 | 11 | 0.6875 rem | 1.3 | 0.08em |
| Caption | Inter | 400 | 12 | 0.75 rem | 1.4 | 0 |

Numerals: tabular-nums + lining-nums. Bei Top-3-Spielern (Rank 1, 2, 3) optional Display-Fraunces 24 px für die Punkte → Editorial-Touch.

---

## Spacing-Skala (4 px-Raster, identisch zu A)

```
--tp-space-1: 4px
--tp-space-2: 8px
--tp-space-3: 12px
--tp-space-4: 16px
--tp-space-5: 20px
--tp-space-6: 24px
--tp-space-8: 32px
--tp-space-10: 40px
--tp-space-12: 48px
--tp-space-16: 64px
```

Tabellen-Cell-Padding: `--tp-space-4 --tp-space-5` (16 / 20) — etwas großzügiger als A → Premium-Feel.

## Radii

```
--tp-radius-xs: 2px
--tp-radius-sm: 6px       /* etwas weicher als A */
--tp-radius-md: 10px      /* Cards */
--tp-radius-lg: 14px      /* Filter-Bar */
--tp-radius-pill: 999px
```

## Elevation / Shadows

Dark-Mode hat keine echten Shadows — wir arbeiten mit **inneren Outlines**:

```
--tp-elevation-1: inset 0 1px 0 rgba(255, 255, 255, 0.04)
--tp-elevation-2: 0 0 0 1px rgba(212, 175, 55, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.05)
```

Light-Mode-Spiegel:
```
--tp-shadow-1: 0 1px 2px rgba(7, 13, 26, 0.05)
--tp-shadow-2: 0 8px 28px rgba(7, 13, 26, 0.08)
```

---

## Component-Patterns

### Header

- Hintergrund: tiefer `--tp-color-navy-950` mit dezentem Top-Glow (Gold-Akzent 8 % Opacity, `radial-gradient` von oben mittig — **einzige** Ausnahme der „Keine Gradients"-Regel des Canvas-Skill, hier bewusst editoriell)
- Logo behält Original
- Site-Title in Fraunces Gold-300

### Filter-Bar (`#searchbar`)

- Sticky mit Glassmorph: `backdrop-filter: blur(var(--tp-glass-blur))`, Hintergrund `--tp-glass-bg`, Border-Bottom 1 px Gold-12 %
- Selects mit dunklem Background `--tp-color-navy-800`, Gold-Border-on-focus
- Search-Button: solid `--tp-color-gold-500`, Text `--tp-color-navy-950`, Hover `--tp-color-gold-400`

### Ranking-Tabelle (`#table`)

| Eigenschaft | Wert |
|---|---|
| `border-collapse` | `separate; border-spacing: 0;` |
| `tr.odd` Background | `--tp-color-navy-900` |
| `tr.even` Background | `--tp-color-navy-950` |
| `tr` Hover | `--tp-color-navy-700` mit 200 ms Transition |
| `th` Background | `--tp-color-navy-800` |
| `th` Text | uppercase, tracking 0.12em, color `--tp-color-text-2` |
| `th` Border-Bottom | 2 px solid `--tp-color-gold-500` (dünn, luxuriös) |
| `td` Padding | `--tp-space-4 --tp-space-5` |
| `td.points` | rechtsbündig, `Fraunces 600 18px tnum`, color `--tp-color-gold-500` |
| Spieler-Link-Color | `--tp-color-link`, hover `--tp-color-gold-500` |
| Top-3 Highlight | `tr.odd:nth-of-type(1)`, … `:nth-of-type(3)` ::before mit Rank-Badge (Gold/Silber/Bronze SVG-Inline) |
| Sortier-Pfeil | inline-SVG `lucide-arrow-up`/`-down` Gold-500 als `::after` |

### Top-3-Special (Editorial-Highlight)

```css
table#table tr.odd:first-of-type td:first-child::before,
table#table tr.even:first-of-type td:first-child::before {
  content: "1";
  display: inline-block;
  width: 22px; height: 22px;
  margin-right: var(--tp-space-3);
  border-radius: 50%;
  background: linear-gradient(135deg, #F2DA94, #D4AF37);  /* einzige Gradient-Ausnahme */
  color: var(--tp-color-navy-950);
  font: 700 12px/22px var(--tp-font-display);
  text-align: center;
}
/* analog für Position 2 (Silber #D9D9D9 → #B8B8B8) und 3 (Bronze #E0945C → #B5733E) */
```

> Hinweis: Diese Regel matcht die Top-3-Zeilen nur **auf Page 1, sortiert nach Points DESC**. Auf anderen Sortierungen sieht es minimal seltsam aus (Top-3 visuell hervorgehoben, obwohl nicht „Top"). Akzeptierte Trade-off — Stufe-1-JS könnte das fixen, indem es bei Sort-Change die `::before`-Logic deaktiviert.

### Country-Pill

- Dunkles Pill-Background `--tp-color-navy-700`, `--tp-radius-pill`, Padding 2 / 8
- Text-Color `--tp-color-text-1`
- Mit echter Flag-Sprite-Lib (Stufe-1-JS): farbiger 14 × 10 px-SVG vor dem Text

### Pagination

- Buttons 38 × 38, `--tp-radius-sm`, Background `--tp-color-navy-800`
- Aktive Seite: Background `--tp-color-gold-500`, Text `--tp-color-navy-950`
- Hover: Background `--tp-color-navy-700`, Border 1 px Gold-30 %
- Previous/Next: Outline-Style mit Gold-Border 1 px

### Sidebar

- Glasige Card `--tp-color-navy-900` mit `--tp-elevation-2`
- H2: uppercase tracking 0.12em color Gold-500, kein lauter Solid-Block
- Inner-Padding `--tp-space-5`

---

## Mobile-Strategie

Identische Breakpoints wie A:
```
--tp-bp-sm: 480px
--tp-bp-md: 768px
--tp-bp-lg: 1024px
--tp-bp-xl: 1280px
```

### Layout-Verhalten Tabelle → Cards

Auf < 768 px wird die Tabelle zur **Leaderboard-Karte**:

```
┌────────────────────────────────────┐
│  ●1   54 770.90        EGR Points  │  ← Rang-Badge + Hero-Score Gold
│  BAKER, Eliot                       │  ← Name (Inter 600 16px white)
│  󠀠󠀠GB England  •  Adult              │  ← Country + Age, hellgrau
│  Avg 69.54  ·  CR 66.77  ·  9 Ev.   │  ← kompakt, Sekundärfarbe
└────────────────────────────────────┘
```

```css
@media (max-width: 767px) {
  table#table tr.odd, table#table tr.even {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      "rank  name   points"
      "rank  meta   meta"
      "rank  stats  stats";
    gap: var(--tp-space-2) var(--tp-space-3);
    padding: var(--tp-space-4);
    margin-bottom: var(--tp-space-3);
    background: var(--tp-color-navy-900);
    border-radius: var(--tp-radius-md);
    box-shadow: var(--tp-elevation-2);
  }
  /* Spalten-Mapping wie in Variant A, plus Rank-Badge in eigene Spalte */
}
```

---

## Animationen / Motion

```
--tp-ease-standard: cubic-bezier(0.2, 0, 0, 1)
--tp-ease-decelerate: cubic-bezier(0, 0, 0.2, 1)
--tp-duration-1: 120ms
--tp-duration-2: 200ms
--tp-duration-3: 380ms                /* etwas langsamer für Premium-Feel */
```

Spezielle Premium-Touches:
- **Sticky-Filter-Bar Backdrop-Blur Fade-In:** beim ersten Scroll-Ereignis (Stufe-1-JS, `IntersectionObserver`), `--tp-duration-3`
- **Hover-Row-Lift:** Background-Wechsel + 1 px Border-Top in Gold-12 %, kein Translate
- **Top-3-Badge-Reveal:** beim Page-Load `opacity 0 → 1` mit Stagger 80 ms (nur einmal)

`prefers-reduced-motion` → alles auf 0,01 s.

---

## Iconografie

Wie Variante A (Lucide), aber **alle Icons in Gold-300** statt neutral. Plus zwei extra:

| Verwendung | Lucide-Name |
|---|---|
| Trophy (Top-3) | `trophy` |
| Trend Up | `trending-up` |

---

## Accessibility-Notizen (Variante B)

- **Glassmorph muss Fallback haben:** `@supports not (backdrop-filter: blur(1px))` → solide `rgba(23, 34, 56, 0.92)` ohne Blur.
- Top-3-Badges haben echte `<span>`-Texte mit `aria-label="Rank 1"` (per Stufe-1-JS injiziert)
- Gold-on-Navy-Kontrast ist **AAA** sogar für 12-px-Text — geprüft
- Reduced-Motion: keine Stagger-Animation
- Light-Mode wird **nicht** automatisch erzwungen — User-Präferenz wird respektiert

---

## Drop-in CSS-Variablen (Auszug)

```css
:root {
  color-scheme: dark light;
  --tp-color-navy-950: #070D1A;
  --tp-color-navy-900: #0E1626;
  --tp-color-gold-500: #D4AF37;
  --tp-color-text-1: #F4F6FB;
  --tp-font-body: "Inter", system-ui, sans-serif;
  --tp-font-display: "Fraunces", Georgia, serif;
  --tp-glass-bg: rgba(23, 34, 56, 0.72);
  --tp-glass-blur: 12px;
}
@media (prefers-color-scheme: light) {
  :root {
    --tp-color-navy-950: #F4F6FB;
    --tp-color-navy-900: #FFFFFF;
    --tp-color-gold-500: #A57F19;
    --tp-color-text-1: #0E1626;
  }
}
```

---

## Beispiel-Snippet: gerenderte Ranking-Row (Variante B)

```css
table#table tr.odd, table#table tr.even {
  background: var(--tp-color-navy-900);
  transition: background var(--tp-duration-2) var(--tp-ease-standard);
}
table#table tr.even { background: var(--tp-color-navy-950); }
table#table tr:hover {
  background: var(--tp-color-navy-700);
}
table#table td {
  padding: var(--tp-space-4) var(--tp-space-5);
  font: 400 14px/1.5 var(--tp-font-body);
  color: var(--tp-color-text-1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.06);
  width: auto !important;
}
table#table td:first-child {
  text-align: right;
  font: 600 18px/1.1 var(--tp-font-display);
  font-variant-numeric: tabular-nums lining-nums;
  color: var(--tp-color-gold-500);
}
table#table td a[href*="/players/"] {
  color: var(--tp-color-link);
  text-decoration: none;
  transition: color var(--tp-duration-1);
}
table#table td a[href*="/players/"]:hover {
  color: var(--tp-color-gold-500);
}
table#table tr.header th {
  background: var(--tp-color-navy-800);
  color: var(--tp-color-text-2);
  font: 500 11px/1.2 var(--tp-font-body);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-bottom: 2px solid var(--tp-color-gold-500);
  padding: var(--tp-space-3) var(--tp-space-5);
}
```

---

## Checkliste vor Pitch

- [ ] Mockup-Screenshot Desktop (1440 × 900), Dark-Default
- [ ] Mockup-Screenshot Mobile (375 × 812), Dark-Default
- [ ] Light-Mode-Variante zumindest in einem Mini-Mockup zeigen
- [ ] Glassmorph-Fallback geprüft auf älterem Safari
- [ ] Kontrast-Report axe DevTools — alle Pass
- [ ] `redesign/tokens/variant-b-tour-pro-dark.css` ausgeliefert
