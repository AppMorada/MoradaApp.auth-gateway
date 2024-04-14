#!/bin/sh

TARGET=$1
GCP_FUCTION_PORT=$2
SIGNATURE_TYPE="http"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RESET_COLOR='\033[0m'

INFO_FLAG="[${CYAN}INFO${RESET_COLOR}]"

echo "${INFO_FLAG} Enabling node.js source maps"
export NODE_OPTIONS="--enable-source-maps"

echo "${INFO_FLAG} Starting ${ORANGE}${TARGET}${RESET_COLOR} in development mode on ${ORANGE}${GCP_FUCTION_PORT}${RESET_COLOR}"

node --inspect=0.0.0.0:9229 node_modules/@google-cloud/functions-framework/build/src/main.js --target=$TARGET \
    --port=$GCP_FUCTION_PORT \
    --signature-type=$SIGNATURE_TYPE
