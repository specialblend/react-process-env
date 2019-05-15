#!/usr/bin/env bash
cat support/README.md > README.md && \
jsdoc2md dist/index.esm.js >> README.md && \
git add README.md && \
git add support/ && \
git commit -m "update docs"
