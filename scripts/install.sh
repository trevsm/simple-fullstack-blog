#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "${CYAN}Installing <client> dependencies...${NC}\n"
cd codebase/client
yarn install

printf "${CYAN}Installing <server> dependencies...${NC}\n"
cd ../server
yarn install