#!/usr/bin/env bash
# Script de deploiement interactif des Edge Functions ENKI Reality
# Usage: ./scripts/deploy-edge-functions.sh [--dry-run]
#
# IMPORTANT: ne pas deployer google-maps-agent (deja en production, statut stable)

set -euo pipefail

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
  echo "=== DRY RUN MODE ==="
fi

if ! command -v supabase >/dev/null 2>&1; then
  echo "ERREUR: CLI 'supabase' non trouvee. Installer via:" >&2
  echo "  brew install supabase/tap/supabase" >&2
  echo "  ou npm install -g supabase" >&2
  exit 1
fi

echo "CLI supabase trouvee: $(supabase --version)"
echo

FUNCTIONS=(
  "agentic-search"
  "send-notification"
  "generate-seo"
  "commission-trigger"
  "parse-document"
  "extract-full-hierarchy"
  "extract-properties-ai"
  "fetch-interests"
  "simple-pdf-extractor"
  "advanced-document-parser"
  "lexaia-call"
  "lexaia-mock"
  "backfill-project-images"
  "ensure-project-photos"
  "image-proxy"
  "db-trigger"
)

echo "Fonctions a deployer (16 au total):"
for fn in "${FUNCTIONS[@]}"; do
  echo "  - $fn"
done
echo
echo "NOTE: google-maps-agent NE SERA PAS deploye (deja en production)."
echo

read -rp "Continuer ? (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Annule."
  exit 0
fi

success=0
failed=0
FAILED_FUNCTIONS=()

for fn in "${FUNCTIONS[@]}"; do
  echo
  echo "=========================================="
  echo "Fonction: $fn"
  echo "=========================================="
  read -rp "Deployer $fn ? (y/N/q) " ans
  if [[ "$ans" == "q" || "$ans" == "Q" ]]; then
    echo "Arret demande."
    break
  fi
  if [[ "$ans" != "y" && "$ans" != "Y" ]]; then
    echo "Skip $fn"
    continue
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    echo "[DRY-RUN] supabase functions deploy $fn"
    success=$((success+1))
    continue
  fi

  if supabase functions deploy "$fn"; then
    echo "OK: $fn deploye"
    success=$((success+1))
  else
    echo "ECHEC: $fn"
    failed=$((failed+1))
    FAILED_FUNCTIONS+=("$fn")
  fi
done

echo
echo "=========================================="
echo "Resume:"
echo "  Deployees avec succes: $success"
echo "  Echecs: $failed"
if [[ ${#FAILED_FUNCTIONS[@]} -gt 0 ]]; then
  echo "  Fonctions en echec:"
  for f in "${FAILED_FUNCTIONS[@]}"; do
    echo "    - $f"
  done
fi
echo "=========================================="

echo
echo "Pour tester apres deploiement, voir les DEPLOY.md de chaque fonction:"
echo "  ls supabase/functions/*/DEPLOY.md"
