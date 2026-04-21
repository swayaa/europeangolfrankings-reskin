# Tech-Stack (global, alle 3 Varianten)

> Diese Datei beschreibt den **gemeinsamen** technischen Boden für alle drei Design-Varianten. Variant-spezifische Abweichungen stehen in den jeweiligen `design-systems/variant-*.md`.

## Re-Skin-Philosophie

Wir bauen **kein** neues Frontend. Wir liefern dem Betreiber ein **Drop-in-Paket**, das in seine bestehende Ruby-on-Rails-App eingebaut wird:

```
[Rails-App, unverändert]
   │
   │  rendert HTML wie bisher
   ▼
[application.css]   ← DAS hier tauschen wir aus
[application.js]    ← optional, wenn JS-Helfer dabei sind
   │
   ▼
[Browser zeigt: gleiche Inhalte, modernes Aussehen]
```

**Wichtigste Regel:** Server-Side-Output (HAML-Templates, Controller, Routes) bleibt **unangetastet**. Wir arbeiten ausschliesslich client-seitig.

## Browser-Support

| Browser | Version | Begründung |
|---|---|---|
| Chrome / Edge / Brave | letzte 2 Major | ~75 % Marktanteil |
| Safari (Desktop + iOS) | 15+ | Container-Queries seit 16, Fallback für 15 |
| Firefox | letzte 2 Major | – |
| ~~IE 11~~ | **nicht** | Original hat Fallback-Stylesheets, wir entfernen sie |

Verwendete moderne Features (alle stabil seit ≥ 2023):
- CSS Custom Properties (`--token`)
- `clamp()`, `min()`, `max()`
- CSS Grid + Flexbox
- Container Queries (`@container`) – mit `@media`-Fallback
- `:has()` – nur Progressive-Enhancement, keine Kernfunktion
- `prefers-color-scheme`, `prefers-reduced-motion`

## Fonts: Hosting-Strategie

| Option | Pro | Contra | Empfehlung |
|---|---|---|---|
| Google Fonts CDN | sehr schnell, gratis | DSGVO-Risiko (US-Server) | ❌ |
| **Self-hosted via `@font-face`** | DSGVO-konform, kein Drittanbieter | 1× Fonts in `app/assets/fonts/` ablegen | ✅ |
| System-Fonts | Null Bytes | designt nicht so klar | Variante C (Editorial) okay |

**Lieferung:** Wir packen die `.woff2`-Files in `redesign/fonts/`, der Betreiber kopiert sie in `app/assets/fonts/`. CSS-Variablen weisen auf den Rails-Asset-Pfad (`url(<%= asset_path 'inter-variable.woff2' %>)` — wird vom Betreiber eingesetzt, wir liefern den Platzhalter `url(/assets/inter-variable.woff2)`).

## Icons

| Option | Größe | Anpassbar |
|---|---|---|
| **Lucide (inline SVG)** | ~ 1 KB pro Icon | ✅ via `currentColor` |
| Font-Awesome | groß | nein |
| Eigene SVG-Sprites | klein | ja |

**Wahl:** Lucide-SVGs inline im CSS-Background oder als HTML-Insert via JS. Pro Variante kuratierte Auswahl von 8–12 Icons (Sortier-Pfeile, Filter, Such-Lupe, Pagination, Country-Flag-Fallback).

## Optionale JS-Enhancements

Drei abgestufte Stufen — der Betreiber wählt aus:

| Stufe | Was | Datei |
|---|---|---|
| **0 (Minimum)** | Nur CSS, alles bleibt SSR | `application.new.css` |
| **1 (Empfohlen)** | + Mobile Table→Card-Toggle, Sticky-Header on scroll, Keyboard-Shortcuts | `+ application.new.js` (~ 4 KB) |
| **2 (Premium)** | + Client-Side Filter-Speedup auf der „All"-Seite (13 652 Zeilen) | `+ ranking-fast-filter.js` (~ 8 KB) |

Wir liefern **alle drei Stufen**. Der Betreiber sieht nach 1 Tag Live-Test, was er behalten will.

## Build / Bundling

**Keiner.** Bewusst.

- Wir liefern **plain `.css` und `.js`**, die der Betreiber direkt in `app/assets/stylesheets/` bzw. `app/assets/javascripts/` ablegen kann.
- Rails' Asset-Pipeline (Sprockets oder Propshaft) macht den Rest (Minify, Fingerprint, Gzip).
- Kein Webpack, kein Vite, kein npm-install, **null neue Dependencies** für den Betreiber.

## Performance-Budget

Ziele für die `/ranking`-Seite (mit 100 Spielern):

| Metric | Original (gemessen am Mirror) | Ziel | Werkzeug |
|---|---|---|---|
| Initial HTML | 196 KB | < 200 KB | – |
| CSS | ~ 60 KB | **< 25 KB** (gzipped < 8 KB) | – |
| JS | jQuery + 4 Plugins ≈ 130 KB | **< 30 KB** (Stufe 1) | – |
| Web Fonts | 0 | < 60 KB (1 Variable Font) | woff2 |
| Lighthouse-Performance | ~ 65 | **> 90** mobile | DevTools |
| Lighthouse-A11y | ~ 70 | **> 95** | DevTools |
| LCP | ~ 2,1 s | **< 1,2 s** | – |

## Accessibility-Mindeststandard (alle Varianten)

- WCAG 2.1 **AA** — keine Verhandlung
- Tastatur-Nav vollständig (Tab-Reihenfolge, Skip-Link „Zum Ranking springen")
- Sichtbarer Focus-Ring (2 px, Variante-spezifische Akzentfarbe)
- `prefers-reduced-motion` respektiert (alle Animationen → 0,01 s)
- `aria-sort` an den `<th>`-Sortier-Spalten
- `<caption>` an `<table>` (per JS injizierbar, falls HAML-Edit nicht erwünscht)
- Country-Spalte: bei Flag-Pill bleibt der Ländername als Text erhalten
- Kontrast Body-Text ≥ 4,5:1, Large-Text ≥ 3:1
- Form-Labels korrekt verknüpft (sind sie schon — wir bauen nur drum herum)

## Lieferpaket-Struktur

```
redesign/
├── tokens/                      # Variant-spezifische Custom Properties
│   ├── variant-a-fairway-modern.css
│   ├── variant-b-tour-pro-dark.css
│   └── variant-c-stat-lab-editorial.css
├── application.new.css          # Final ausgewählte Variante (Drop-in)
├── application.new.js           # Stufe 1 JS-Enhancements
├── fonts/                       # .woff2-Files
└── INTEGRATION.md               # An den Betreiber: 5-Min-Einbau
```

## Rollback-Plan für den Betreiber

1. Backup der alten `application.css` als `application.legacy.css.bak`.
2. Neue `application.new.css` als `application.css` einspielen.
3. **Falls Probleme:** alte Datei zurückkopieren, Cache leeren, in 30 Sekunden ist alles wie vorher.

Kein Datenrisiko, kein Ausfall, **null** Server-Restart nötig (Rails serviert die neue Datei beim nächsten Request, bei Sprockets reicht `bin/rails assets:clobber && bin/rails assets:precompile` in Prod).
