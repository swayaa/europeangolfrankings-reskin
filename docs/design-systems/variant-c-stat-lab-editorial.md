# Variante C — „Stat-Lab Editorial"

> Maximal datengetrieben, fast Terminal-Look. Für Coaches und Statistik-Nerds, die das Ranking als Werkzeug nutzen, nicht zum Anschauen.

## Brand-Story / Mood

Stat-Lab Editorial ist die **datendichteste** Richtung. Sie behandelt das Ranking wie ein Bloomberg-Terminal für Amateurgolf: monospace Zahlen, kompakte Zeilen, hohe Informationsdichte, **kein Schnickschnack**. Dafür subtile Editorial-Typografie an den Stellen, an denen es zählt (Section-Headers, Site-Title).

Mood-Anker:
- **Bloomberg / Refinitiv / FT Markets**
- **Editorial Tooling** — Substack-Editor-Look-and-feel
- **Power-User-Werkzeug** — Tastatur-Shortcuts sichtbar, Sortier-Status präzise

Zielgruppe: Coaches, Statistik-Enthusiasten, Daten-Journalisten, Vereins-Manager.

---

## Tech-Stack (Variant-spezifisch)

| Asset | Wahl | Größe | Bezugsquelle |
|---|---|---|---|
| **Body / Headline-Font** | **System-Font-Stack** (San Francisco / Segoe UI / Inter) | 0 KB | nativ |
| **Mono-Font** | JetBrains Mono Variable (latin) | ~ 42 KB woff2 | jetbrains.com (OFL) |
| **Editorial-Headline** (optional) | Newsreader Variable | ~ 48 KB woff2 | Google Fonts self-hosted |
| **Icons** | Lucide Icons inline-SVG (nur 6 Icons gebraucht) | ~6 KB | lucide.dev |
| **Country-Flags** | **Bewusst keine** — stattdessen ISO-3166-2-Code als Mono-Tag | – | – |
| **JS-Helfer** | **Stufe 2 dringend empfohlen**: client-side Filter + Sort + Tastatur-Shortcuts | ~ 8 KB | – |

Die Editorial-Variante nimmt den **System-Font** als Default — das spart 38 KB Inter und gibt der Seite einen platform-nativen Werkzeug-Charakter.

---

## Farb-Palette

> **Auch diese Variante ist Light-Mode-First**, aber mit sehr neutralem, fast Papier-haftem Hintergrund (nicht reines Weiß).

### Brand-Farben

| Token | Hex | RGB | Verwendung |
|---|---|---|---|
| `--sl-color-paper` | `#FBFBF8` | 251, 251, 248 | Body-Background (warmes Off-White) |
| `--sl-color-surface` | `#FFFFFF` | 255, 255, 255 | Tabellen-Background, Cards |
| `--sl-color-rule` | `#1B1B1B` | 27, 27, 27 | Editorial Hairlines (1 px schwarz) |
| `--sl-color-rule-soft` | `#D4D4D0` | 212, 212, 208 | Sekundäre Hairlines |
| `--sl-color-ink` | `#0A0A0A` | 10, 10, 10 | Primärer Text (fast schwarz, leicht warm) |
| `--sl-color-ink-2` | `#5A5A5A` | 90, 90, 90 | Sekundärer Text |
| `--sl-color-ink-3` | `#9A9A95` | 154, 154, 149 | Tertiärer Text |
| `--sl-color-accent` | `#E63946` | 230, 57, 70 | Editorial-Akzent (Karmin-Rot — wie FT-Pink, aber kräftiger) |
| `--sl-color-accent-soft` | `#FFE2E5` | 255, 226, 229 | Sehr leichte Akzent-Surface |
| `--sl-color-up` | `#0E7C3A` | Trend nach oben |
| `--sl-color-down` | `#B91C1C` | Trend nach unten |

### Dark-Mode-Spiegel

| Token | Hex | Verwendung |
|---|---|---|
| `--sl-color-paper` | `#0E0E0E` | Body |
| `--sl-color-surface` | `#171717` | Tabelle |
| `--sl-color-rule` | `#FAFAFA` | Hairlines |
| `--sl-color-rule-soft` | `#3A3A3A` | Sekundäre Hairlines |
| `--sl-color-ink` | `#F5F5F5` | Text |
| `--sl-color-ink-2` | `#A3A3A3` | Sekundärer Text |
| `--sl-color-accent` | `#F87171` | Akzent (heller, lesbarer im Dark) |
| `--sl-color-accent-soft` | `#3A1818` | Akzent-Surface |

### Funktionale Farben

| Token | Hex | Verwendung |
|---|---|---|
| `--sl-color-link` | `#1A4FB8` | Spieler-Detail-Links (Editorial-Blau) |
| `--sl-color-link-hover` | `#E63946` | Akzent-Rot |
| `--sl-color-mark-bg` | `#FFF3A3` | Such-Treffer-Highlight |

### Kontrast-Tabelle (WCAG-AA)

| Vordergrund / Hintergrund | Kontrast | Status |
|---|---|---|
| `--ink #0A0A0A` auf `--paper #FBFBF8` | 19.2 : 1 | AAA |
| `--ink-2 #5A5A5A` auf `--paper #FBFBF8` | 7.0 : 1 | AAA |
| `--accent #E63946` auf `--paper #FBFBF8` | 4.6 : 1 | AA |
| `--accent #E63946` auf `#FFFFFF` (Surface) | 4.7 : 1 | AA |
| Dark `#F5F5F5` auf `#0E0E0E` | 17.8 : 1 | AAA |

---

## Typografie

| Rolle | Font | Weight | Größe (px) | Größe (rem) | Line-Height | Tracking |
|---|---|---|---|---|---|---|
| Site-Title (Header) | Newsreader (optional) | 600 | 28 | 1.75 rem | 1.15 | -0.01em |
| Section H2 | Newsreader oder system-serif | 600 | 16 | 1 rem | 1.3 | -0.005em |
| Tabellen-Header `<th>` | System-Sans | 600 | 11 | 0.6875 rem | 1.2 | 0.04em (uppercase) |
| Body / Tabellen-Daten | System-Sans | 400 | 13 | 0.8125 rem | **1.35** (kompakt!) | 0 |
| Punkte / Scores | **JetBrains Mono** | 500 | 13 | 0.8125 rem | 1.35 | 0 (mono) |
| Country-Code | JetBrains Mono | 500 | 11 | 0.6875 rem | 1.2 | 0.04em |
| Labels | System-Sans | 500 | 11 | 0.6875 rem | 1.3 | 0.04em |
| Caption / Footer | System-Sans | 400 | 11 | 0.6875 rem | 1.4 | 0 |
| Tastatur-Shortcut-Hint | JetBrains Mono | 400 | 10 | 0.625 rem | 1 | 0 |

System-Font-Stack:
```css
--sl-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, system-ui, sans-serif;
--sl-font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
--sl-font-serif: "Newsreader", Georgia, "Times New Roman", serif;
```

---

## Spacing-Skala (4 px-Raster, kompakter als A/B)

```
--sl-space-1: 2px       /* sehr eng */
--sl-space-2: 4px
--sl-space-3: 8px
--sl-space-4: 12px
--sl-space-5: 16px
--sl-space-6: 24px
--sl-space-8: 32px
--sl-space-10: 40px
```

Tabellen-Cell-Padding: `--sl-space-3 --sl-space-4` (8 / 12) — **dichter** als A/B → mehr Zeilen aufs Screen.

## Radii

```
--sl-radius-xs: 0
--sl-radius-sm: 2px       /* Editorial: kaum Rundungen */
--sl-radius-md: 4px
--sl-radius-pill: 999px   /* nur Country-Code-Tag */
```

Editorial-Look = harte Kanten. Buttons sind quasi rechteckig.

## Shadows

**Keine**. Editorial-Look arbeitet nur mit Hairline-Borders (`--sl-color-rule`).

---

## Component-Patterns

### Header

- Schwarzer 1-px-Strich `border-bottom: 1px solid var(--sl-color-rule)`
- Site-Title links, Newsreader 28 px
- Sub-Nav als horizontale Hairline-Tabs (Underline-Style, kein Background)
- Werbung im Header maximal als kleine 11 px Rechtsausrichtung

### Filter-Bar (`#searchbar`)

- Inline-Layout, NICHT sticky (Editorial-Charakter — Filter sind eine eigene „Region")
- Selects als `borderless` mit Underline-Style: `border: none; border-bottom: 1px solid var(--sl-color-rule);`
- Search-Button: Outline-Style, schwarze Border 1 px, Hover-Background `--sl-color-ink`, Text Wechsel zu `--sl-color-paper`
- **Tastatur-Shortcut-Anzeige:** rechts neben jedem Filter ein kleines `<kbd>` mit `f1`, `f2` etc.

### Ranking-Tabelle (`#table`)

| Eigenschaft | Wert |
|---|---|
| `border-collapse` | `collapse` |
| `tr.odd` Background | `--sl-color-surface` |
| `tr.even` Background | `--sl-color-surface` (kein Zebra! Zeilen-Trenner via Hairline) |
| `tr` Hover | `--sl-color-accent-soft` |
| `tr` Border-Bottom | 1 px solid `--sl-color-rule-soft` |
| `tr.header` Border-Top + Bottom | 1 px solid `--sl-color-rule` (Editorial-Schwarz) |
| `th` Background | transparent |
| `th` Text | uppercase, 11 px, `--sl-color-ink-2` |
| `td.points` | rechtsbündig, **JetBrains Mono 500 13px**, color `--sl-color-ink` |
| `td.score`, `td.css` | mono, rechtsbündig |
| Spieler-Link-Color | `--sl-color-link`, hover `--sl-color-accent`, **kein** Underline (Editorial: Link-Color reicht) |
| Sortier-Pfeil | textuelles `↑` / `↓` in Mono-Font, **kein SVG** |
| Aktive Sortier-Spalte | `<th>` Border-Bottom 2 px solid `--sl-color-accent` |

### Sparkline (Premium-Bonus, nur mit Stufe-2-JS)

In einer **neuen** Spalte (oder als `::after` an `td.points`): kleine SVG-Sparkline der letzten 5 Events des Spielers. Da wir **keine** neuen Daten haben, wäre das eine Mock-Demo bzw. brauchte einmaligen Backend-Hook (out of scope für V1, aber ein guter Pitch-Punkt).

> **Empfehlung:** Sparklines im Pitch zeigen, im V1 weglassen, in V1.1 nachziehen, sobald der Betreiber Lust hat.

### Country-Code-Tag (statt Flag)

```html
<td>England</td>
```

```css
table#table td:nth-child(3) {
  font-family: var(--sl-font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--sl-color-ink-2);
}
/* Optional via Stufe-1-JS: data-country="ENG" → ISO-3-Code als Tag */
[data-country] {
  display: inline-block;
  padding: 1px 6px;
  border: 1px solid var(--sl-color-rule-soft);
  border-radius: var(--sl-radius-sm);
}
```

### Pagination

- Editorial-Pagination: `← Prev   1 / 137   Next →` plus jump-to: `Go to page [__]`
- Buttons als reine Text-Links mit Underline on-hover, **keine** Boxes
- Aktive Seite in `--sl-color-accent`, fett

### Sidebar

- Hairline-Box: 1 px Border `--sl-color-rule-soft`, **kein** Background
- H2: Newsreader 16 px, `--sl-color-ink`, 1 px Underline `--sl-color-rule`

### Tastatur-Shortcuts (Stufe-1-JS)

| Shortcut | Aktion |
|---|---|
| `/` | Filter „Last Name" fokussieren |
| `f` | Filter-Bar fokussieren |
| `n` | Nächste Seite |
| `p` | Vorherige Seite |
| `s` | Sortier-Spalte „Score" |
| `c` | Sortier-Spalte „Country" |
| `g` `g` | Zur Top der Tabelle |
| `?` | Hilfe-Overlay |

---

## Mobile-Strategie

Identische Breakpoints wie A/B:
```
--sl-bp-sm: 480px
--sl-bp-md: 768px
--sl-bp-lg: 1024px
--sl-bp-xl: 1280px
```

### Layout-Verhalten Tabelle → kompakte Liste (NICHT Cards!)

Stat-Lab nutzt auf Mobile **kompakte Listenzeilen**, keine luxuriösen Cards:

```
─────────────────────────────────────
1   54 770.90  BAKER, Eliot     ENG  
    Adult · 69.54 / 66.77 · 9 ev    ↗
─────────────────────────────────────
2   47 013.00  GREHAN, Stuart   IRL
    Adult · 70.44 / 67.56 · 9 ev    →
─────────────────────────────────────
```

Hairlines, Mono-Numerals, sehr dicht (~ 10–12 Zeilen pro Screen auf iPhone SE).

---

## Animationen / Motion

**Kaum.** Editorial-Charakter heißt: Daten, nicht Bewegung.

```
--sl-duration-1: 80ms    /* fast instant */
--sl-duration-2: 160ms
```

Verwendung:
- Hover-Background-Wechsel auf Tabellen-Zeilen: `--sl-duration-1`
- Filter-Reveal: `--sl-duration-2`

`prefers-reduced-motion` → 0,01 s.

---

## Iconografie

**Minimalistisch:** nur 6 Icons, alle Lucide:

| Verwendung | Lucide-Name |
|---|---|
| Sortier auf | `chevron-up` |
| Sortier ab | `chevron-down` |
| Such-Lupe | `search` |
| Pagination prev/next | `chevron-left`/`-right` |
| Hilfe | `help-circle` |
| Tastatur | `keyboard` |

Kein Trophy, kein Trend-Symbol, keine Flag — Editorial bleibt textuell.

---

## Accessibility-Notizen (Variante C)

- **Mono-Numerals + tabular-nums** sorgen für perfekte vertikale Ausrichtung
- Tastatur-Shortcuts sind **immer** dokumentiert per `?`-Overlay
- Such-Treffer mit `<mark>` (Stufe-1-JS) — von Screenreadern als „Markiert" angesagt
- Reduced-Motion: alle Hover-Transitions deaktiviert
- High-Contrast (Windows): explizite `forced-colors` Media-Query, alle wichtigen Borders mit `border: 1px solid CanvasText`
- Country-Code statt Flag: **besser** für Screenreader (echte Worte: „England" statt „Bild ohne Alt")

---

## Drop-in CSS-Variablen (Auszug)

```css
:root {
  color-scheme: light dark;
  --sl-color-paper: #FBFBF8;
  --sl-color-surface: #FFFFFF;
  --sl-color-ink: #0A0A0A;
  --sl-color-rule: #1B1B1B;
  --sl-color-accent: #E63946;
  --sl-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, system-ui, sans-serif;
  --sl-font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
  --sl-font-serif: "Newsreader", Georgia, serif;
  --sl-space-3: 8px;
  --sl-radius-sm: 2px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --sl-color-paper: #0E0E0E;
    --sl-color-surface: #171717;
    --sl-color-ink: #F5F5F5;
    --sl-color-rule: #FAFAFA;
    --sl-color-accent: #F87171;
  }
}
```

---

## Beispiel-Snippet: gerenderte Ranking-Row (Variante C)

```css
table#table {
  border-collapse: collapse;
  font-family: var(--sl-font-sans);
  font-size: 13px;
  line-height: 1.35;
  color: var(--sl-color-ink);
}
table#table tr {
  border-bottom: 1px solid var(--sl-color-rule-soft);
  transition: background var(--sl-duration-1);
}
table#table tr.header {
  border-top: 1px solid var(--sl-color-rule);
  border-bottom: 1px solid var(--sl-color-rule);
}
table#table tr:hover {
  background: var(--sl-color-accent-soft);
}
table#table th {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--sl-color-ink-2);
  padding: var(--sl-space-3) var(--sl-space-4);
  text-align: left;
}
table#table td {
  padding: var(--sl-space-3) var(--sl-space-4);
  width: auto !important;
}
table#table td:first-child,                     /* Punkte */
table#table td:nth-child(5),                    /* Avg. Score */
table#table td:nth-child(6),                    /* Avg. CR */
table#table td:nth-child(7) {                   /* Events */
  font-family: var(--sl-font-mono);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
table#table td:nth-child(3) {                   /* Country */
  font-family: var(--sl-font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--sl-color-ink-2);
}
table#table td a[href*="/players/"] {
  color: var(--sl-color-link);
  text-decoration: none;
}
table#table td a[href*="/players/"]:hover {
  color: var(--sl-color-accent);
}
/* Aktive Sortier-Spalte: textueller Pfeil */
table#table tr.header.asc th.points::after { content: " ↑"; color: var(--sl-color-accent); }
table#table tr.header.desc th.points::after { content: " ↓"; color: var(--sl-color-accent); }
```

---

## Checkliste vor Pitch

- [ ] Mockup-Screenshot Desktop (1440 × 900) — Light
- [ ] Mockup-Screenshot Mobile (375 × 812)
- [ ] Bonus: Sparkline-Mockup (für V1.1-Roadmap-Pitch)
- [ ] Tastatur-Shortcut-Demo-Video (10 s) — sehr stark im Pitch
- [ ] `redesign/tokens/variant-c-stat-lab-editorial.css` ausgeliefert
