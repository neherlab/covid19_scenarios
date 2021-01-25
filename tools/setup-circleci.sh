#!/usr/bin/env bash

# Creates CircleCI contexts and sets environment variables
# Requires CircleCI Local CLI: https://circleci.com/docs/2.0/local-cli/

set -o errexit
set -o pipefail
shopt -s dotglob
trap "exit" INT

THIS_DIR=$(cd $(dirname "${BASH_SOURCE[0]}"); pwd)

# Put your GITHUB_TOKEN into .env file
[ -f "${THIS_DIR}/../.env.example" ] && source "${THIS_DIR}/../.env.example"
[ -f "${THIS_DIR}/../.env" ] && source "${THIS_DIR}/../.env"

CIRCLECI_VCS=github
CIRCLECI_ORG=neherlab
CIRCLECI_PROJECT=covid19_scenarios

BRANCHES=(
  master \
  release \
  staging \
)

VAR_NAMES=(
  AWS_ACCESS_KEY_ID \
  AWS_SECRET_ACCESS_KEY \
  AWS_CLOUDFRONT_DISTRIBUTION_ID \
  AWS_S3_BUCKET \
  AWS_DEFAULT_REGION \
  ENV_NAME \
  FULL_DOMAIN \
  WEB_HOST \
  WEB_PORT_PROD \
  WEB_SCHEMA \
)

for branch in "${BRANCHES[@]}"; do
  for var_name in "${VAR_NAMES[@]}"; do
    var_name_for_branch_key="${branch}_${var_name}"
    declare -n "var_name_for_branch_value=${var_name_for_branch_key}"

    if [ -z "${var_name_for_branch_value}" ]; then
      echo "Error: the required variable ${var_name_for_branch_key} is not set. Refusing to proceed. The configuration is not changed."
    fi

  done
done

for branch in "${BRANCHES[@]}"; do
  CONTEXT_NAME="${CIRCLECI_PROJECT}-${branch}"
  circleci context create "${CIRCLECI_VCS}" "${CIRCLECI_ORG}" "${CONTEXT_NAME}"

  for var_name in "${VAR_NAMES[@]}"; do
    var_name_for_branch_key="${branch}_${var_name}"
    declare -n "var_name_for_branch_value=${var_name_for_branch_key}"
    echo $var_name_for_branch_value | tr -d '\n' | circleci context store-secret "${CIRCLECI_VCS}" "${CIRCLECI_ORG}" "${CONTEXT_NAME}" "${var_name}"
  done
done
