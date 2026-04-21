---
name: preview-mirror
description: "Erstellt eine lokale Live-Preview aus dem gespiegelten Rails-Output mit der gewählten Re-Skin-Variante. Use when needing to visually validate a CSS variant against the real DOM, before delivering to the operator."
---

# Skill: preview-mirror

## Zweck

Die echte Live-Seite kann ich nicht patchen — ich habe nur einen Mirror in `mirror/www.europeangolfrankings.com/ranking.html`. Mit diesem Skill erstelle ich eine 1:1-Kopie der gemirrorten Datei in `preview/index.html` und hänge dort meine eigene CSS davor — so kann der Kollege live im Browser sehen, wie die geplante Änderung im echten DOM aussieht.

## Voraussetzungen

- `mirror/www.europeangolfrankings.com/ranking.html` existiert (Read-Only)
- `redesign/tokens/variant-{a|b|c}.css` existiert
- Ggf. `redesign/application.new.css` mit den Component-Stilen

## Workflow

### Schritt 1: Variante wählen
Frage den User (oder lese aus `.cursor/rules/20-design-systems.mdc`), welche Variante aktuell aktiv ist.

### Schritt 2: Preview-HTML erzeugen

Kopiere `mirror/www.europeangolfrankings.com/ranking.html` nach `preview/index.html` und füge im `<head>` **nach** dem alten Stylesheet die neuen Token + Component-CSS ein:

```html
<!-- bestehender Original-Tag bleibt: -->
<link href="../mirror/www.europeangolfrankings.com/assets/application.css%3Fbody=1.css"
      media="screen" rel="stylesheet" type="text/css" />

<!-- Re-Skin-Schicht (überschreibt das Alte): -->
<link href="../redesign/tokens/variant-a-fairway-modern.css" rel="stylesheet" />
<link href="../redesign/application.new.css" rel="stylesheet" />

<!-- Pflicht für Mobile: -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> Pfade sind relativ zu `preview/index.html`. Wenn die Original-Asset-URLs im Mirror absolute Pfade nutzen, ggf. anpassen.

### Schritt 3: Lokal anschauen

```bash
xdg-open preview/index.html   # Linux
# oder
open preview/index.html       # macOS
# oder ein winziger HTTP-Server, falls Asset-Pfade relativ-Probleme machen:
python3 -m http.server 4444 --directory preview
```

### Schritt 4: Variantenwechsel

Tausche im `<head>`-Block die Token-Datei (`variant-a` / `variant-b` / `variant-c`). Component-CSS bleibt gleich, weil sie nur Custom Properties referenziert.

## Hinweis auf Variant-Wechsel via Query-Param

Optional: `preview/index.html` kann ein winziges Inline-Script enthalten:
```html
<script>
  const v = new URLSearchParams(location.search).get('v') || 'a';
  document.querySelector('[data-variant-link]').href =
    `../redesign/tokens/variant-${v}-${ {a:'fairway-modern', b:'tour-pro-dark', c:'stat-lab-editorial'}[v] }.css`;
</script>
```

Damit kann man `preview/index.html?v=b` öffnen und zwischen den drei Varianten umschalten — ideal für den Pitch.

## Output

Die Datei `preview/index.html` ist nach diesem Skill ladebereit. Cli-Status auch in der Antwort an den User berichten.
