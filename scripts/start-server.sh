#!/bin/bash

set -eo pipefail

function cleanup() {
   docker-compose down --rmi all
}
trap cleanup EXIT

docker-compose up \
  --build \
  --exit-code-from mysql_database \
  -V