#! /usr/bin/env bash
set -ex

yarn --force

#yarn app:jetify
#if [[ "$OSTYPE" == "darwin"* ]]; then
#  yarn app:pod
#fi

cd ./packages

cp server/.env.local server/.env
#cp app/.env.local app/.env
cp web/.env.local web/.env

cd ..

#yarn update
yarn update-schema
yarn web:relay
