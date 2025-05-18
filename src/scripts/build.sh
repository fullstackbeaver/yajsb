#!/bin/bash

##### remove the old library
if [ -d "/home/lionel/Documents/dev/personal/site-genrator demo/node_modules/yajsb/lib" ]; then
    rm -r "/home/lionel/Documents/dev/personal/site-genrator demo/node_modules/yajsb/lib"
fi

bun run build #--minify

cp -r "./lib" "/home/lionel/Documents/dev/personal/site-genrator demo/node_modules/yajsb/lib"

# cp -r "./src/adapters/adminInterface" "/home/lionel/Documents/dev/personal/site-genrator demo/node_modules/yajsb/lib/adminInterface"