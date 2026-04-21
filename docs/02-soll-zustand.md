# Soll-Zustand & Erfolgskriterien

> Was muss am Ende des Re-Skins „besser" sein als heute? Diese Datei ist die Definition-of-Done für den Pitch beim Betreiber.

## Nicht-Ziele (explizit raus)

- ❌ Kein neuer Tech-Stack (Rails bleibt)
- ❌ Keine neuen Features (kein Vergleich, keine Watchlist, kein Export)
- ❌ Keine Logo-/Brand-Änderung (Logo bleibt 1:1)
- ❌ Keine inhaltliche Änderung (gleiche Spalten, gleiche Filter, gleiche Sortierung)
- ❌ Kein neues Hosting

## Ziele (Pitch-relevant)

### 1. Mobil endlich nutzbar
- Heute: Pinch-Zoom-Hölle auf 960 px fixed
- Soll: Auf 375 px-Devices (iPhone SE, kleinstes relevantes Format) muss die Ranking-Tabelle als **vertikale Karten-Liste** lesbar sein, ohne horizontales Scrollen.

### 2. Visuelles Update
- Moderne Typografie (variable Fonts, klare Hierarchie)
- Saubere Datenanzeige (tabular-numerals für Punkte, Scores)
- Dezent, nicht übertrieben — Golf-Publikum erwartet Seriosität

### 3. Performance
- Lighthouse-Performance ≥ 90 (mobile)
- LCP < 1,2 s
- CSS-Bundle < 25 KB unkomprimiert (< 8 KB gzipped)

### 4. Accessibility
- WCAG 2.1 AA — alle Kontraste, Tastaturnavigation komplett, Screenreader-tauglich
- Lighthouse-A11y ≥ 95

### 5. Dark-Mode optional
- `prefers-color-scheme` automatisch
- Manueller Toggle nur, wenn Stufe-1-JS verwendet wird

### 6. Null-Risiko-Einbau
- Drop-in CSS, ein-File-Tausch, 5-Minuten-Rollback möglich
- Keine Server-Restarts, keine DB-Migrations, keine Gem-Updates

## Mess-Tabelle (vorher / nachher)

| Metrik | Heute | Ziel | Wie messen |
|---|---|---|---|
| Lighthouse Performance (Mobile) | ~ 65 | ≥ 90 | Chrome DevTools |
| Lighthouse Accessibility | ~ 70 | ≥ 95 | Chrome DevTools |
| LCP (Mobile, Slow 4G) | ~ 2,1 s | < 1,2 s | DevTools / WebPageTest |
| CSS-Bundle-Größe | ~ 60 KB | < 25 KB | `wc -c` |
| Mobile-tauglich (375 px) | ❌ | ✅ | manuelle Sichtprüfung |
| WCAG-AA-Verstöße | mehrere | 0 | axe DevTools |
| Setup-Aufwand für Betreiber | – | < 10 Min | INTEGRATION.md |

## Pitch-Argumentation für den Betreiber

In einer Zeile pro Argument:

1. **Null Risiko:** Eine Datei ersetzen. Rollback in 30 Sekunden.
2. **Null Folgekosten:** Kein Build, kein npm, kein neuer Service.
3. **Mobile gewonnen:** Plötzlich ist die Hälfte der Nutzer happy.
4. **Werbung sichtbar:** Sidebar-Banner werden auf Mobile direkt unter der Tabelle gezeigt — bessere Klickrate.
5. **SEO besser:** Lighthouse > 90 wirkt sich auf Google-Ranking aus.
6. **Logo & Inhalt unverändert:** Stammnutzer finden alles wieder.

## Out-of-Scope-Liste (was später kommen kann)

Wenn der Betreiber nach 1 Tag Pilot mehr will, sind das die nächsten möglichen Schritte (jeder einzeln entscheidbar):

- [ ] Player-Detail-Seite ebenfalls re-skinnen (`/players/{id}/Counting/All`)
- [ ] Events-Seite re-skinnen
- [ ] Stufe-2-JS: client-side Filter auf der „All"-Seite (13 652 Zeilen sofort filtern)
- [ ] Country-Flag-Pills mit echten SVG-Flags
- [ ] PDF-Export pro Spieler/Land
- [ ] Player-Vergleich (zwei Spieler nebeneinander)
- [ ] Push-Benachrichtigungen bei Ranglistenänderungen (PWA)
- [ ] Multi-Sprache (DE / EN / SV / NL)
