#!/usr/bin/env bash

# Creates CircleCI contexts and sets environment variables
# Requires CircleCI Local CLI: https://circleci.com/docs/2.0/local-cli/

set -o errexit
set -o pipefail
shopt -s dotglob
trap "exit" INT

THIS_DIR=$(cd $(dirname "${BASH_SOURCE[0]}"); pwd)

pushd /tmp >/dev/null

curl -fsS "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -oqq awscliv2.zip
sudo ./aws/install --update

popd >/dev/null
