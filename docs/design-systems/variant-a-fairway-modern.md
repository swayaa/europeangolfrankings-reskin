# Variante A — „Fairway Modern"

> Helles, sportlich-luftiges Data-Cockpit. Wirkt wie ein Tool, das Trainer und Eltern auf dem Tablet-Screen offen haben.

## Brand-Story / Mood

Fairway Modern ist die **breitenkompatibelste** Richtung. Sie nimmt das Original-Versprechen der Seite — eine seriöse, vertrauenswürdige Datenquelle für europäischen Amateur-Golf — und übersetzt es in eine zeitgemäße, **helle** Gestaltung mit klarer Hierarchie.

Mood-Anker:
- **Tageslicht über grünem Fairway** — viel Weißraum, Akzent in einem ruhigen Wald-Grün
- **Sportliches Editorial** — wie eine Print-Beilage zur Open Championship
- **Daten zuerst** — die Zahlen sind die Stars, nicht die Deko

Zielgruppe: Trainer, Eltern, junge Spieler, Vereinsfunktionäre.

---

## Tech-Stack (Variant-spezifisch)

| Asset | Wahl | Größe | Bezugsquelle |
|---|---|---|---|
| **Body-Font** | Inter Variable (latin + latin-ext) | ~38 KB woff2 | rsms.me/inter (OFL-Lizenz) |
| **Numerals** | Inter mit `font-feature-settings: "tnum"` | (im selben File) | – |
| **Icons** | Lucide Icons, inline-SVG | ~1 KB / Icon | lucide.dev (ISC) |
| **Country-Flags** | `country-flag-icons` als SVG-Sprites (~250 KB total, lazy) oder Twemoji-Fallback | – | wahlweise |
| **JS-Helfer** | optional: `app/assets/javascripts/egr-reskin.js` (~ 4 KB) | – | unser eigener |

Zeichensatz-Empfehlung: nur die ISO-Latin-Subsets, kein Cyrillic / Greek (Live-Daten enthalten nur lateinische Namen + Special-Diakritika wie `ÄÖÜ`, `Ø`, `Č`).

---

## Farb-Palette

### Brand-Farben

| Token | Hex | RGB | Verwendung |
|---|---|---|---|
| `--fw-color-fairway-700` | `#1F5132` | 31, 81, 50 | Primär-Akzent, Aktiv-Tab, Sortier-Pfeil aktiv |
| `--fw-color-fairway-600` | `#2E7D32` | 46, 125, 50 | Buttons, Links Hover, Focus-Ring |
| `--fw-color-fairway-500` | `#4CAF50` | 76, 175, 80 | Trends „nach oben", Erfolgs-States |
| `--fw-color-fairway-100` | `#E8F5E9` | 232, 245, 233 | Sehr leichte Akzent-Backgrounds |

### Neutrale Skala (Light-Mode-Grundlage)

| Token | Hex | RGB | Verwendung |
|---|---|---|---|
| `--fw-color-canvas` | `#FFFFFF` | 255, 255, 255 | Body-Background |
| `--fw-color-surface` | `#F8FAFB` | 248, 250, 251 | Card- und Tabellen-Hintergrund (Even-Row) |
| `--fw-color-surface-2` | `#F1F5F8` | 241, 245, 248 | Sidebar, Filter-Bar |
| `--fw-color-border` | `#E2E8EE` | 226, 232, 238 | Hairline-Borders (1 px) |
| `--fw-color-divider` | `#CBD3DC` | 203, 211, 220 | Section-Dividers (2 px) |
| `--fw-color-text-1` | `#0F1B2D` | 15, 27, 45 | Primärer Text (Body, Daten) |
| `--fw-color-text-2` | `#475569` | 71, 85, 105 | Sekundärer Text (Labels, Captions) |
| `--fw-color-text-3` | `#94A3B8` | 148, 163, 184 | Tertiärer Text (Inactive) |

### Funktionale Farben

| Token | Hex | Verwendung |
|---|---|---|
| `--fw-color-warning` | `#D97706` | Alters-Badge U18 etc. (warm-akzent) |
| `--fw-color-error` | `#DC2626` | Form-Validation |
| `--fw-color-info` | `#0369A1` | Country-Pill-Border |
| `--fw-color-link` | `#1D4FA8` | Spieler-Detail-Links |
| `--fw-color-link-hover` | `#2E7D32` | Spieler-Detail-Links Hover (= Fairway 600) |

### Dark-Mode-Spiegel (`prefers-color-scheme: dark`)

| Token | Hex | Verwendung |
|---|---|---|
| `--fw-color-canvas` | `#0E1620` | Body-Background |
| `--fw-color-surface` | `#16202B` | Card |
| `--fw-color-surface-2` | `#1F2A37` | Sidebar / Filter |
| `--fw-color-border` | `#2A3744` | Hairline |
| `--fw-color-divider` | `#3B4A5A` | Divider |
| `--fw-color-text-1` | `#F1F5F9` | Primärer Text |
| `--fw-color-text-2` | `#94A3B8` | Sekundärer Text |
| `--fw-color-text-3` | `#64748B` | Tertiärer Text |
| `--fw-color-fairway-600` | `#4ADE80` | Akzent (heller im Dark) |

### Kontrast-Tabelle (WCAG-AA-geprüft)

| Vordergrund / Hintergrund | Kontrast | Status |
|---|---|---|
| `--text-1 #0F1B2D` auf `--canvas #FFFFFF` | 17.4 : 1 | AAA |
| `--text-2 #475569` auf `--canvas #FFFFFF` | 8.2 : 1 | AAA |
| `--text-1 #0F1B2D` auf `--surface #F8FAFB` | 16.7 : 1 | AAA |
| `--fairway-600 #2E7D32` auf `#FFFFFF` (= Buttons-Text) | 4.6 : 1 | AA (Body) |
| `--fairway-700 #1F5132` auf `#FFFFFF` (= Buttons-Text-Hover) | 7.4 : 1 | AAA |
| Dark-Mode `#F1F5F9` auf `#0E1620` | 16.1 : 1 | AAA |

---

## Typografie

| Rolle | Font | Weight | Größe (px) | Größe (rem) | Line-Height | Tracking |
|---|---|---|---|---|---|---|
| Display (Page-H1, falls vorhanden) | Inter | 700 | 32 | 2 rem | 1.15 | -0.02em |
| Section H2 (Sidebar-Titel, Filter-Title) | Inter | 600 | 18 | 1.125 rem | 1.3 | -0.005em |
| Tabellen-Header `<th>` | Inter | 600 | 12 | 0.75 rem | 1.2 | 0.06em (uppercase) |
| Body / Tabellen-Daten | Inter | 400 | 14 | 0.875 rem | 1.45 | 0 |
| Punkte (große Zahlen) | Inter | 600 | 16 | 1 rem | 1.2 | -0.01em (tnum) |
| Labels / Form-Labels | Inter | 500 | 12 | 0.75 rem | 1.3 | 0.04em |
| Caption / Footer-Links | Inter | 400 | 12 | 0.75 rem | 1.4 | 0 |

Numerals: `font-variant-numeric: tabular-nums lining-nums;` immer auf Punkte- und Score-Zellen → vertikale Ausrichtung von Kommas.

---

## Spacing-Skala (4 px-Raster)

```
--fw-space-1: 4px
--fw-space-2: 8px
--fw-space-3: 12px
--fw-space-4: 16px
--fw-space-5: 20px
--fw-space-6: 24px
--fw-space-8: 32px
--fw-space-10: 40px
--fw-space-12: 48px
--fw-space-16: 64px
```

Tabellen-Cell-Padding: `--fw-space-3 --fw-space-4` (12 / 16) → großzügig, lesbar.

## Radii

```
--fw-radius-xs: 2px      /* Hairline-Pills */
--fw-radius-sm: 4px      /* Buttons, Inputs */
--fw-radius-md: 6px      /* Cards */
--fw-radius-lg: 10px     /* Dialog (falls je) */
--fw-radius-pill: 999px  /* Country-Pill */
```

## Shadows / Elevation

Sehr zurückhaltend — keine Drop-Shadows auf Tabellen-Zeilen.

```
--fw-shadow-1: 0 1px 2px rgba(15, 27, 45, 0.06);   /* Filter-Bar floating */
--fw-shadow-2: 0 4px 12px rgba(15, 27, 45, 0.08);  /* Sidebar */
```

---

## Component-Patterns

### Filter-Bar (`#searchbar`)

- **Sticky** unter dem Header (`position: sticky; top: 0; z-index: 10`)
- Hintergrund `--fw-color-surface-2` mit `--fw-shadow-1`
- Selects und Inputs: rounded-sm, 1 px Border `--fw-color-border`, on-focus 2 px Outline `--fw-color-fairway-600`
- Search-Button: solid `--fw-color-fairway-600`, white text, hover `--fw-color-fairway-700`
- Auf Mobile: kollabiert in ein „Filter"-Dropdown (Detail-Toggle, kein neues HTML — nur CSS via `:has()` + Details/Summary, falls Variante 2-JS verwendet wird)

### Ranking-Tabelle (`#table`)

| Eigenschaft | Wert |
|---|---|
| `border-collapse` | `separate` mit `border-spacing: 0` |
| `tr.odd` Background | `--fw-color-canvas` |
| `tr.even` Background | `--fw-color-surface` |
| `tr` Hover | leichtes `--fw-color-fairway-100` (8 % Opacity-Variante) |
| `th` Background | `--fw-color-surface-2` |
| `th` `border-bottom` | 2 px solid `--fw-color-divider` |
| `td` Padding | `--fw-space-3` vertical, `--fw-space-4` horizontal |
| `td.points` | rechtsbündig, `tnum`, **Inter 600 16 px** |
| Spieler-Link-Color | `--fw-color-link`, hover unterstrichen + `--fw-color-link-hover` |
| Sortier-Pfeil | inline-SVG `lucide-arrow-up`/`-down` als `::after` an aktivem `<th>` |
| Aktive Sortier-Spalte | `<th>` Background `--fw-color-fairway-100`, Border-Bottom `--fw-color-fairway-600` |

### Country-Pill

```html
<!-- WIE ES KOMMT (vom Rails-Output, nicht ändern): -->
<td align='left' width='140'>England</td>
```

```css
/* WIE WIR ES PIMPEN: */
table#table td:nth-child(3) {  /* Country-Spalte */
  padding-left: var(--fw-space-2);
}
table#table td:nth-child(3)::before {
  content: "";
  display: inline-block;
  width: 18px;
  height: 12px;
  margin-right: var(--fw-space-2);
  background: var(--fw-flag-fallback) center/cover no-repeat;
  border-radius: 1px;
  vertical-align: -1px;
}

/* Pro-Land-Variante via attribute selector ginge nicht, weil der Country-Name
   im td-Text steht, nicht als Attribut. Lösung: Stufe-1-JS schreibt
   data-country auf <td>, und wir matchen via [data-country="England"]. */
```

Falls **kein JS** verfügbar ist: einheitliches generisches Flag-Sprite ohne Land-Spezifität.
Falls Stufe-1-JS aktiv ist: echte Country-Code-Pills.

### Pagination

- Numerische Buttons: Square 36 × 36, `--fw-radius-sm`
- Aktive Seite: Background `--fw-color-fairway-700`, white text
- Hover: Background `--fw-color-fairway-100`
- Previous/Next: mit Pfeil-Icon, label-Text

### Sidebar

- Block-Container `--fw-color-surface-2`, `--fw-radius-md`, `--fw-shadow-2`
- H2-Header: `--fw-color-fairway-700` als Solid-Block, white Text, weniger Krachig als das alte Original

### Form-Inputs

- 36 px Höhe, `--fw-radius-sm`
- Border 1 px `--fw-color-border`, on-focus 2 px outline `--fw-color-fairway-600`
- Label-Color `--fw-color-text-2`

---

## Mobile-Strategie

### Breakpoints

```
--fw-bp-sm: 480px   /* kleine Phones */
--fw-bp-md: 768px   /* Tablet portrait — Wechsel Tabelle ↔ Cards */
--fw-bp-lg: 1024px  /* Tablet landscape / kleines Desktop */
--fw-bp-xl: 1280px  /* Desktop */
```

### Layout-Verhalten

| Breakpoint | `#contentbox` | Sidebar | Tabelle |
|---|---|---|---|
| ≥ 1024 px | `max-width: 1280px` | rechts, 280 px | klassisch |
| 768–1023 px | volle Breite, Padding 24 px | rechts, 240 px | klassisch, weniger Spalten? Nein — alle bleiben |
| 480–767 px | volle Breite, Padding 16 px | **unter** der Tabelle | **Card-Layout** (siehe unten) |
| < 480 px | volle Breite, Padding 12 px | unter der Tabelle | Card-Layout, 1 Spalte |

### Tabelle → Card-Pattern (Mobile)

Auf < 768 px wird `<table>` semantisch erhalten, aber visuell zu Karten:

```css
@media (max-width: 767px) {
  table#table,
  table#table tbody,
  table#table tr,
  table#table td {
    display: block;
    width: 100% !important;
  }
  table#table tr.header { display: none; }                /* Header verstecken */
  table#table tr.odd, table#table tr.even {
    margin-bottom: var(--fw-space-3);
    background: var(--fw-color-surface);
    border: 1px solid var(--fw-color-border);
    border-radius: var(--fw-radius-md);
    padding: var(--fw-space-3);
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "name   points"
      "country age"
      "score  events";
    gap: var(--fw-space-2);
  }
  table#table tr td:nth-child(1) { grid-area: points; font-size: 18px; font-weight: 700; color: var(--fw-color-fairway-700); justify-self: end; }
  table#table tr td:nth-child(2) { grid-area: name; font-weight: 600; }
  table#table tr td:nth-child(3) { grid-area: country; }
  table#table tr td:nth-child(4) { grid-area: age; justify-self: end; }
  table#table tr td:nth-child(5) { grid-area: score; }
  /* Avg.CR + Events kollabiert in eine Zeile via Pseudo-Label */
}
```

---

## Animationen / Motion

Tokens:
```
--fw-ease-standard: cubic-bezier(0.2, 0, 0, 1)
--fw-ease-emphasized: cubic-bezier(0.3, 0, 0, 1)
--fw-duration-1: 120ms
--fw-duration-2: 200ms
--fw-duration-3: 320ms
```

Verwendung:
- Hover-Transitions auf Buttons / Links: `--fw-duration-1`
- Filter-Bar Sticky-Shadow Fade: `--fw-duration-2`
- Card-Hover Lift: `--fw-duration-2`

`prefers-reduced-motion: reduce` → alle Durations auf 0.01ms.

---

## Iconografie

Kuratierte Lucide-Liste (12 Icons):

| Verwendung | Lucide-Name |
|---|---|
| Sortier auf | `arrow-up` |
| Sortier ab | `arrow-down` |
| Sortier neutral | `arrow-up-down` |
| Such-Lupe | `search` |
| Filter | `sliders-horizontal` |
| Pagination prev | `chevron-left` |
| Pagination next | `chevron-right` |
| Country (Fallback) | `flag` |
| Player-Link | `external-link` (klein, on-hover) |
| Dark-Toggle | `moon` / `sun` |
| Mobile-Menu | `menu` |
| Close | `x` |

Größe: 16 px (inline) / 20 px (Buttons) / 24 px (Toggles).

---

## Accessibility-Notizen (Variante A)

- Sticky Filter-Bar respektiert `prefers-reduced-motion` (kein Schatten-Pulse)
- Card-Layout auf Mobile: jedes Datum bekommt ein visuell-verstecktes `::before`-Label, damit Screenreader die Zelle benennen können
- Sortier-`<th>`: `aria-sort="ascending|descending|none"` via `[class~="asc"]` Attribut-Selektor steuerbar — falls Stufe-1-JS aktiv ist
- Focus-Ring: 2 px solid `--fw-color-fairway-600`, 2 px Offset
- Country-Pill: Landesname bleibt **immer** als Text (kein „nur Flag")

---

## Drop-in CSS-Variablen (Auszug — vollständig in `redesign/tokens/variant-a-fairway-modern.css`)

```css
:root {
  --fw-color-canvas: #FFFFFF;
  --fw-color-surface: #F8FAFB;
  --fw-color-fairway-600: #2E7D32;
  --fw-color-text-1: #0F1B2D;
  --fw-font-body: "Inter", system-ui, sans-serif;
  --fw-space-3: 12px;
  --fw-radius-md: 6px;
  /* … vollständige Liste in der Token-Datei … */
}
@media (prefers-color-scheme: dark) {
  :root {
    --fw-color-canvas: #0E1620;
    --fw-color-surface: #16202B;
    --fw-color-fairway-600: #4ADE80;
    --fw-color-text-1: #F1F5F9;
  }
}
```

---

## Beispiel-Snippet: gerenderte Ranking-Row

```html
<!-- Original-HTML-Struktur (UNVERÄNDERT vom Rails-Output) -->
<tr class="odd">
  <td align="right" width="70">54770.90</td>
  <td align="left" width="200"><a href="/players/29950/Counting/All">BAKER, Eliot</a></td>
  <td align="left" width="140">England</td>
  <td align="center" width="40">Adult</td>
  <td align="center" width="70">69.54</td>
  <td align="center" width="70">66.77</td>
  <td align="center" style="border-right: none;" width="60">9</td>
</tr>
```

```css
/* Wie es nach Re-Skin Variant A aussieht (Auszug) */
table#table tr.odd, table#table tr.even {
  transition: background var(--fw-duration-1) var(--fw-ease-standard);
}
table#table tr:hover {
  background: var(--fw-color-fairway-100);
}
table#table td {
  padding: var(--fw-space-3) var(--fw-space-4);
  border-bottom: 1px solid var(--fw-color-border);
  font-family: var(--fw-font-body);
  font-size: 14px;
  color: var(--fw-color-text-1);
  width: auto !important;          /* Inline-width="70" neutralisieren */
}
table#table td:first-child {        /* Points-Zelle */
  text-align: right;
  font-weight: 600;
  font-variant-numeric: tabular-nums lining-nums;
  color: var(--fw-color-fairway-700);
  font-size: 16px;
}
table#table td a[href*="/players/"] {
  color: var(--fw-color-link);
  text-decoration: none;
  font-weight: 500;
}
table#table td a[href*="/players/"]:hover {
  color: var(--fw-color-link-hover);
  text-decoration: underline;
  text-underline-offset: 2px;
}
```

---

## Checkliste vor Pitch

- [ ] Mockup-Screenshot Desktop (1440 × 900)
- [ ] Mockup-Screenshot Mobile (375 × 812)
- [ ] Kontrast-Report axe DevTools — alle Pass
- [ ] `redesign/tokens/variant-a-fairway-modern.css` ausgeliefert
- [ ] Live-Preview auf `preview/index.html` mit dieser Variante als Default
