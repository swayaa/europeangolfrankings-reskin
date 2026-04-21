# Re-Skin-Integration — 5-Minuten-Anleitung für den Betreiber

> Liebe Kollegin / lieber Kollege,
> dieses Dokument beschreibt, wie das Re-Skin-Paket in die bestehende Rails-App eingebaut wird. Es sind **keine** Code-Änderungen am Backend nötig, **keine** Gem-Updates, **kein** Build-Step. Eine CSS-Datei, eine JS-Datei (optional), Ordner für Schriften — fertig.

## Was ist drin?

```
redesign/
├── tokens/
│   ├── variant-a-fairway-modern.css
│   ├── variant-b-tour-pro-dark.css
│   └── variant-c-stat-lab-editorial.css
├── application.new.css         # die zentrale CSS, importiert eine Token-Datei
├── application.new.js          # optional: Mobile-Toggle, Tastatur-Shortcuts (~ 4 KB)
├── ranking-fast-filter.js      # optional: Client-Side-Filter für die "All"-Seite (~ 8 KB)
└── fonts/
    └── *.woff2
```

## Drei Varianten, eine Wahl

Wir haben drei vollständige Designs vorbereitet. Bitte eine entscheiden — die Auswahl ändert nur, welche Token-Datei in `application.new.css` importiert wird:

```css
/* in application.new.css ganz oben: */
@import url("./tokens/variant-a-fairway-modern.css");   /* oder -b- / -c- */
```

Spec-Doku im Pitch-Material: siehe Anhang oder `docs/design-systems/`.

## Einbau Schritt für Schritt

### 1. Backup
```bash
cd <RAILS_ROOT>
cp app/assets/stylesheets/application.css \
   app/assets/stylesheets/application.legacy.css.bak
```

### 2. Re-Skin-Files ablegen
```bash
cp -r redesign/tokens             app/assets/stylesheets/egr-tokens
cp redesign/application.new.css   app/assets/stylesheets/egr-reskin.css
cp redesign/fonts/*.woff2         app/assets/fonts/
```

### 3. Manifest-File aktualisieren

Variante A) Sprockets — in `application.css`:
```css
/*
 *= require_self
 */
@import "egr-tokens/variant-a-fairway-modern.css";   /* eine wählen */
@import "egr-reskin.css";
```

Variante B) Propshaft — direkt im Layout-HAML:
```haml
%link{rel: "stylesheet", href: asset_path("egr-tokens/variant-a-fairway-modern.css")}
%link{rel: "stylesheet", href: asset_path("egr-reskin.css")}
```

### 4. Optional: JS-Helfer

```bash
cp redesign/application.new.js app/assets/javascripts/egr-reskin.js
```

In `application.js`-Manifest:
```js
//= require jquery
//= require jquery_ujs
//= require egr-reskin
```

### 5. Asset-Pfad für Schriften

In `config/initializers/assets.rb` falls noch nicht drin:
```ruby
Rails.application.config.assets.paths << Rails.root.join("app", "assets", "fonts")
Rails.application.config.assets.precompile += %w(*.woff2)
```

### 6. Viewport-Meta-Tag im Layout (einmalig)

Damit Mobile überhaupt funktioniert, muss in `app/views/layouts/application.html.haml` (oder `.erb`) im `<head>`:

```haml
%meta{name: "viewport", content: "width=device-width, initial-scale=1"}
```

Falls schon drin: nichts zu tun.

### 7. Asset-Precompile + Deploy

```bash
RAILS_ENV=production bin/rails assets:clobber
RAILS_ENV=production bin/rails assets:precompile
# regulärer Deploy / Server-Reload
```

## Verifikations-Checkliste

| Check | Wo | Erwartet |
|---|---|---|
| `/ranking` lädt ohne JS-Fehler | DevTools → Console | leer |
| Tabelle hat moderne Optik | visuell | klar erkennbar |
| Sortier-Klick funktioniert | Klick auf „EGR Points" | Seite lädt sortiert (gleiches GET-Reload-Verhalten wie vorher) |
| Filter funktioniert | Country = Germany, Search | Spieler aus DE |
| Mobile 375 px | DevTools Responsive | Tabelle wird zur Karten-Liste, kein horizontales Scrollen |
| Pagination funktioniert | Klick „2" | Seite 2 lädt |
| Sidebar-Werbung sichtbar | Desktop rechts, Mobile unter Tabelle | sichtbar |
| Logo unverändert | Header | wie vorher |

## Rollback (falls etwas nicht passt)

```bash
cd <RAILS_ROOT>/app/assets/stylesheets
cp application.legacy.css.bak application.css
RAILS_ENV=production bin/rails assets:clobber assets:precompile
```

Cache leeren, alles ist wie vorher.
**Datenbank, Routen, Controller, Views — komplett unangetastet.**

## Häufige Stolpersteine

| Problem | Ursache | Lösung |
|---|---|---|
| Tabelle ist immer noch breit | Inline-`width="70"` an `<td>` | Token-CSS hat den Reset; sicherstellen, dass die neue CSS **nach** der alten geladen wird |
| Pfeile fehlen bei Sortierung | Variante nutzt SVG / Text statt Pixel-PNG | Wir injizieren via `::after` mit data-URI — sollte automatisch greifen |
| Schrift ist Arial statt Inter | Fonts-Pfad falsch | `config/initializers/assets.rb` prüfen, Asset-Path verifizieren |
| Mobile bleibt 980 px | Viewport-Meta-Tag fehlt | Schritt 6 ausführen |

## Performance-Erwartungen

| Metric | vorher | nachher (Ziel) |
|---|---|---|
| Lighthouse Performance (mobile) | ~ 65 | ≥ 90 |
| Lighthouse Accessibility | ~ 70 | ≥ 95 |
| LCP (Slow 4G) | ~ 2,1 s | < 1,2 s |
| CSS-Bundle-Größe | ~ 60 KB | < 25 KB |

## Tracking & Analytics

Matomo bleibt unangetastet. Der `<script>`-Block im Footer wird nicht berührt — Tracking-Pixel und Click-Events funktionieren weiter.

## Nächste mögliche Schritte (nach Pilot)

Nicht im V1, aber später denkbar:
- [ ] Player-Detail-Seite ebenfalls re-skinnen
- [ ] Events-Seite re-skinnen
- [ ] Stufe-2-JS aktivieren (client-side Filter auf der „All"-Seite)
- [ ] Country-Flag-Pills mit echten SVG-Flags

Bei Fragen: Code-Owner ist <Name deines Freundes>. Vollständige Spec-Doku im Repo unter `docs/`.
