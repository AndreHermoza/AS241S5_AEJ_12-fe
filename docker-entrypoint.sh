#!/bin/sh
set -e

API_BACKEND_URL="${API_BACKEND_URL:-http://host.docker.internal:8086}"

sed "s|__API_BACKEND_URL__|${API_BACKEND_URL}|g" /etc/nginx/conf.d/default.conf \
  > /tmp/default.conf
mv /tmp/default.conf /etc/nginx/conf.d/default.conf

exec "$@"
