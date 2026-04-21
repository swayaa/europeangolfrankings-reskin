---
name: swap-css
description: "Wechselt die aktive Re-Skin-Variante (a/b/c) im preview/ und in den Default-Imports. Use when the user wants to compare or switch between Fairway Modern, Tour Pro Dark, and Stat-Lab Editorial."
---

# Skill: swap-css

## Zweck

Eine Hand voll Files referenzieren die jeweils aktive Variante:
- `preview/index.html` (das `<link>`-Tag im `<head>`)
- `redesign/application.new.css` (das `@import` am Anfang)
- `.cursor/rules/20-design-systems.mdc` (Dokumentation der aktiven Wahl)

Dieser Skill aktualisiert sie atomar.

## Mappings

| ID | Slug | Token-File |
|---|---|---|
| `a` | `fairway-modern` | `redesign/tokens/variant-a-fairway-modern.css` |
| `b` | `tour-pro-dark` | `redesign/tokens/variant-b-tour-pro-dark.css` |
| `c` | `stat-lab-editorial` | `redesign/tokens/variant-c-stat-lab-editorial.css` |

## Workflow

### 1. `redesign/application.new.css` Top-Import tauschen

```css
/* WAR: */
@import url("./tokens/variant-a-fairway-modern.css");
/* NEU: */
@import url("./tokens/variant-b-tour-pro-dark.css");
```

### 2. `preview/index.html` `<link data-variant-link>` aktualisieren

```html
<link data-variant-link rel="stylesheet"
      href="../redesign/tokens/variant-b-tour-pro-dark.css" />
```

### 3. `.cursor/rules/20-design-systems.mdc` aktive Wahl notieren

In der Zeile „Aktuell aktiv:" den Slug eintragen.

### 4. Bestätigung an User

Mit dem Pfad zu `preview/index.html` und Hinweis, dass Variant-Param genutzt werden kann (`?v=b`).

## Robustheit

- Wenn der Token-File nicht existiert: Skill abbrechen mit Hinweis
- Wenn `application.new.css` noch nicht existiert: anlegen mit Skelett-Inhalt
