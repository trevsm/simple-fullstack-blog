#!/bin/bash

# Source the environment variables
set -a; source ../.env; set +a

npx rover graph introspect http://localhost:5000/graphql > src/api/generated/schema.graphql