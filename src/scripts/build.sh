#!/bin/bash

##### remove the old library
if [ -d "./lib" ]; then
    rm -r "./lib"
fi

##### type declarations for functions
bun tsc --emitDeclarationOnly --declaration --outDir ./lib

##### clean useless exports for the library
find ./lib -mindepth 1 -type d -exec rm -r {} \;

##### compile the application
bun build ./src/index.ts --outdir ./lib --no-minify --target node --external chokidar  --external jsdom  --external sass  --external zod --external isomorphic-dompurify --verbose