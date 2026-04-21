#!/usr/bin/env bash
# Vollständiger Seiten-Download inkl. eingebetteter Ressourcen (lokal ausführen).
set -euo pipefail

TARGET_DIR="${1:-./mirror-europeangolfrankings}"
mkdir -p "${TARGET_DIR}"
cd "${TARGET_DIR}"

echo "Lade https://www.europeangolfrankings.com/ranking nach ${TARGET_DIR} …"

# robots=off: vermeidet u. a. den nutzlosen robots.txt-Abruf auf pw.* (404).
# Kein --no-clobber: kollidiert mit --convert-links und wird von wget ignoriert.
set +e
wget \
  --execute robots=off \
  --page-requisites \
  --convert-links \
  --adjust-extension \
  --span-hosts \
  --domains=www.europeangolfrankings.com,europeangolfrankings.com,pw.europeangolfrankings.com \
  --timestamping \
  --user-agent="Mozilla/5.0 (compatible; EGR-Archive/1.0)" \
  "https://www.europeangolfrankings.com/ranking"
wget_exit=$?
set -e

MAIN="www.europeangolfrankings.com/ranking.html"
if [[ -f "${MAIN}" ]]; then
  abs="$(pwd)/${MAIN}"
  echo "Fertig. Hauptdatei (lokal): ${MAIN}"
  echo "Im Terminal öffnen (Standard-Browser): xdg-open \"${abs}\""
  echo "Oder im Browser die Adresszeile: file://${abs}"
  if [[ "${wget_exit}" -ne 0 ]]; then
    echo "Hinweis: wget meldete Exit ${wget_exit} (häufig wegen 404 auf veraltete Assets wie indicator.gif). Archiv ist trotzdem nutzbar."
  fi
  exit 0
fi

echo "Fehler: ${MAIN} fehlt (wget Exit ${wget_exit})." >&2
exit "${wget_exit}"
