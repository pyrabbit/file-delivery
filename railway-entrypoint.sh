#! /usr/bin/env bash

set -e

cd web

cd frontend && npm install
bundle install

cd frontend && npm build
rake build:all

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

bin/rails db:create
bin/rails db:migrate

rails server -b 0.0.0.0 -p ${PORT:-3000}
