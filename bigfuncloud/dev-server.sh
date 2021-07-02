#!/bin/bash

cp public/index.html out/
npm run build
reflex -g "src/**/*" -s -- sh -c "npm run build && invalidate-devserver" &
reflex -g "Caddyfile" -s -- sh -c "caddy run && invalidate-devserver"