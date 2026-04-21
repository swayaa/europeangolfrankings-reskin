---
name: visual-diff
description: "Erstellt Vorher-/Nachher-Screenshots der Ranking-Seite (Desktop + Mobile) für jede Variante via cursor-ide-browser. Use after CSS changes or before delivering a pitch."
---

# Skill: visual-diff

## Zweck

Wir wollen vor der Pitch-Übergabe einen visuellen Beleg liefern: 6 Screenshots (Original Desktop/Mobile + 3 Varianten Desktop/Mobile). Dieser Skill orchestriert das systematisch über das `cursor-ide-browser` MCP.

## Voraussetzungen

- `preview/index.html` existiert (siehe Skill `preview-mirror`)
- Lokaler HTTP-Server lauft auf einem Port, oder Dateien sind via `file://`-URLs erreichbar
- `cursor-ide-browser` MCP verfügbar

## Workflow

### Schritt 1: Lokalen Server starten (optional)

```bash
python3 -m http.server 4444 --directory . &
# oder
npx serve -l 4444 .
```

### Schritt 2: Original-Screenshot

Rufe via MCP `browser_navigate` auf:
- `file:///<absoluter-pfad>/mirror/www.europeangolfrankings.com/ranking.html`
- oder `http://localhost:4444/mirror/www.europeangolfrankings.com/ranking.html`

Dann:
- `browser_resize` auf 1440 × 900 → `browser_take_screenshot` → speichern als `docs/design-mockups/baseline-desktop.png`
- `browser_resize` auf 375 × 812 → `browser_take_screenshot` → `docs/design-mockups/baseline-mobile.png`

### Schritt 3: Pro Variante (a, b, c) je 2 Screenshots

Für jede der drei Varianten:
1. Im `<head>` von `preview/index.html` die Token-Variante setzen (siehe Skill `swap-css`)
2. `browser_navigate` zu `http://localhost:4444/preview/index.html?v=<variant>`
3. Desktop + Mobile Screenshots

Output:
```
docs/design-mockups/
├── baseline-desktop.png
├── baseline-mobile.png
├── A-fairway-modern-desktop.png
├── A-fairway-modern-mobile.png
├── B-tour-pro-dark-desktop.png
├── B-tour-pro-dark-mobile.png
├── C-stat-lab-editorial-desktop.png
└── C-stat-lab-editorial-mobile.png
```

### Schritt 4: Vergleichstabelle in `docs/04-pitch-deck.md` einfügen

Markdown-Tabelle mit Bildern nebeneinander.

## Hinweis

Die Mockup-Screenshots sind **echtes gerendertes HTML**, nicht KI-generierte Bilder. Damit sind sie pixelgenau das, was der Betreiber später live sehen wird — viel überzeugender im Pitch.
