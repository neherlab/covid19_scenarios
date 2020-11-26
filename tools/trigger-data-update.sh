#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
shopt -s dotglob
trap "exit" INT

THIS_DIR=$(
  cd $(dirname "${BASH_SOURCE[0]}")
  pwd
)

REPO="neherlab/covid19_scenarios"
EVENT="update-data"

curl -fsS "https://api.github.com/repos/${REPO}/dispatches" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d "{ \"EVENT\": \"${EVENT}\" }" \
  "$@"
