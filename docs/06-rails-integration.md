# Rails-Integration — wie das Drop-in beim Betreiber landet

> 5-Minuten-Anleitung. Diese Datei ist die Vorlage für `redesign/INTEGRATION.md`, die der Betreiber als einzige Anleitung erhält.

## Zielprojekt-Annahmen

Die Live-Seite läuft auf Rails 3 oder 4. Wir setzen voraus, dass die App entweder noch Sprockets nutzt (`app/assets/stylesheets/application.css`) oder bereits auf Propshaft umgestellt wurde. Beides funktioniert mit unserem Drop-in.

Falls ungewöhnlicher Setup vorliegt (z. B. Manifest-Webpacker oder eigene Asset-Lösung), reicht es zu wissen: wir liefern eine **Plain-CSS-Datei**, die irgendwo im Asset-Pfad landen muss, und sie ersetzt / erweitert die heutige.

## Vorgehen — Schritt für Schritt

### Schritt 1: Backup
```bash
cd <RAILS_ROOT>
cp app/assets/stylesheets/application.css app/assets/stylesheets/application.legacy.css.bak
# Falls SCSS:
cp app/assets/stylesheets/application.scss app/assets/stylesheets/application.legacy.scss.bak
```

### Schritt 2: Token-Datei einlegen
Eine der drei Varianten in `app/assets/stylesheets/` ablegen:
```
app/assets/stylesheets/egr-tokens.css      # = redesign/tokens/variant-X.css
app/assets/stylesheets/egr-reskin.css      # = redesign/application.new.css
```

### Schritt 3: Manifest aktualisieren
Wenn Sprockets-Manifest-File (`application.css`) noch genutzt wird:

```css
/*
 *= require_tree .
 *= require_self
 */
@import "egr-tokens.css";
@import "egr-reskin.css";
```

Oder, falls die alte CSS in der Manifest-Liste steht und nicht mehr soll:
```css
/* WAR:  *= require old_styles */
/* JETZT entfernt; egr-reskin ersetzt sie */
@import "egr-tokens.css";
@import "egr-reskin.css";
```

### Schritt 4: Fonts ablegen
```bash
cp redesign/fonts/*.woff2 app/assets/fonts/
```
(Falls Asset-Pipeline es nicht automatisch findet, in `config/initializers/assets.rb`:)
```ruby
Rails.application.config.assets.paths << Rails.root.join("app", "assets", "fonts")
```

### Schritt 5: (Optional) JS-Helfer
```bash
cp redesign/application.new.js app/assets/javascripts/egr-reskin.js
```
Im Manifest:
```js
// = require jquery
// = require jquery_ujs
// = require_tree .
// = require egr-reskin
```

### Schritt 6: Asset-Precompile + Deploy
```bash
RAILS_ENV=production bin/rails assets:clobber
RAILS_ENV=production bin/rails assets:precompile
# dann normaler Deploy / Server-Reload
```

## Verifikations-Checkliste (5 Min nach Deploy)

| Check | Wo | Erwartet |
|---|---|---|
| `/ranking` lädt ohne JS-Fehler | DevTools → Console | leer |
| Tabelle hat moderne Optik | visuell | klar erkennbar |
| Sortier-Klick funktioniert | Klick auf „EGR Points" | Seite lädt sortiert (gleicher GET-Reload wie vorher) |
| Filter funktioniert | Country = Germany, Search | Spieler aus DE |
| Mobile-View 375 px | DevTools → Responsive | Tabelle wird zur Karten-Liste |
| Pagination funktioniert | Klick „2" | Seite 2 lädt |
| Sidebar-Werbung sichtbar | rechts (Desktop) bzw. unter Tabelle (Mobile) | sichtbar |
| Logo unverändert | Header | wie vorher |

## Rollback (falls etwas nicht passt)

```bash
cd <RAILS_ROOT>/app/assets/stylesheets
cp application.legacy.css.bak application.css
RAILS_ENV=production bin/rails assets:clobber assets:precompile
```
Cache leeren, Seite ist wie vorher. **Datenbank, Routen, Controller, Views — alles unangetastet.**

## Häufige Stolpersteine

| Problem | Ursache | Lösung |
|---|---|---|
| Tabelle ist immer noch breit | Inline-`width="70"` an `<td>` | Reset-Block in der Variant-CSS hat ihn überschrieben — sicherstellen, dass die neue CSS **nach** evtl. alten Resten geladen wird |
| Pfeile bei Sortierung fehlen | Variante nutzt SVG statt Pixel-PNG | Wir injizieren via `::after` mit data-URI — sollte automatisch greifen |
| Schrift fällt auf Arial zurück | Fonts-Pfad falsch | `config/initializers/assets.rb` prüfen, Asset-Path verifizieren |
| Mobile bricht Layout | Viewport-Meta fehlt im Layout | **Einmaliger HAML-Edit nötig:** in `app/views/layouts/application.html.haml` ergänzen `%meta{name: "viewport", content: "width=device-width, initial-scale=1"}` |

> **Der Viewport-Meta-Tag ist der einzige unvermeidbare HAML-Edit.** Das ist eine Zeile, die jede moderne Website hat. Ohne ihn schaltet Mobile-Safari nie aus dem 980-px-Modus.

## Tracking & Analytics

Matomo bleibt unangetastet — der `<script>`-Block im Footer wird vom Re-Skin nicht berührt. Tracking-Pixel und Click-Events funktionieren weiter.
