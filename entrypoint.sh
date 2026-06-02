#!/bin/sh

set -eu

SERVICE_TYPE="${1:-http}"

echo "Starting service: ${SERVICE_TYPE}"

if [ "${SERVICE_TYPE}" = "consumer" ]; then
  exec node --import tsx ./cmd/consumer.ts
fi

exec node --import tsx ./cmd/main.ts
