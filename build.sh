#!/bin/sh

set -ex

mkdir -p build
# npm install

npx esbuild src/index.tsx --bundle --loader:.mp3=binary --outfile=out.js

cp public/* build
mv out.js build
mv out.css build

export IMAGE=registry.$BFC_DOMAIN/$BFC_USER/$BFC_APP:latest
docker build -t "$IMAGE" .
docker push "$IMAGE"