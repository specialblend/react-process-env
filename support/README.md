### react-process-env

express utility to safely inject variables from `process.env` (node.js) into `window.env` (react)

### Install

`npm install react-process-env`

### Quick Start

```javascript
// server.js
const fs = require('fs')
const path = require('path')
const express = require('express')
const memoize = require('lodash.memoize')
const { inject } = require('react-process-env')

const resolveIndex = memoize(() => fs.readFile(path.join(__dirname, 'index.html')))

const payload = {
    FOO: process.env.FOO,
    BAR: process.env.BAR,
}

const app = express()
const injectEnv = inject(payload, resolveIndex)
/**
* Injects payload into `window.env` on `index.html`
*/
app.use('/', injectEnv)
```

```javascript
// App.js
import React from 'react'
import { resolve } from 'react-process-env'

export default () => {
    /**
    * Reads window.env.FOO on `express` (production), or process.env.FOO on `react-scripts start` (development)
    */
    const myFoo = resolve('FOO', process.env);
}

```

### :warning: note on `resolve`: 

if you want `resolve` to work in both dev (`react-scripts start`) and production (`node server.js`), pass `process.env` as second argument to `resolve`, or do something like `myFoo = process.env.FOO || resolveEnv('FOO)`.

### Security Considerations

#### :warning: Do NOT pass ANY SECRET DATA in payload

The injected payload will be PUBLIC in `index.html`, so don't pass anything you don't want the world to see.

#### :warning: Do NOT pass `process.env` directly as payload

It's a security risk. If you pass `process.env` directly, it will throw an assertion error.

#### Cross-site scripting (XSS) attack
- Scalar values only - anything else will throw an assertion error.
- Non-scalar keys will automatically be cast to strings.
- The payload will be encoded into base64 before injecting into page to prevent malicious payloads from executing.
