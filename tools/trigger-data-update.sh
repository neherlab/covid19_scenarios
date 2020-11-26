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

# Put your GITHUB_TOKEN into .env file
[ -f "${THIS_DIR}/../.env" ] && source "${THIS_DIR}/../.env"

# or set an environment variable (not recommended)
GITHUB_TOKEN=${GITHUB_TOKEN:?GITHUB_TOKEN is required}


curl -i https://api.github.com/repos/neherlab/covid19_scenarios/dispatches \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -d '{ "event_type": "update-case-counts-data" }' \
