#!/bin/bash

# Source the environment variables
set -a; source ../.env; set +a

# Introspect the GraphQL schema
# curl -sSL https://rover.apollo.dev/nix/latest | sh

rover graph introspect http://localhost:5000/graphql > src/api/generated/schema.graphql