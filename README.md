### react-process-env

Render an object (e.g. a subset of `process.env`) as an html `head` `<script>` that maps its data to `window.env`, useful for passing data from `process.env` to your React app served with express.

### install

`npm install react-process-env`

### use

```javascript
// sever.js
const fs = require('fs')
const path = require('path')
const express = require('express')
const memoize = require('lodash.memoize')
const { injectPayload } = require('react-process-env')

const resolveIndex = memoize(() => fs.readFile(path.join(__dirname, 'index.html')))

const payload = {
    FOO: process.env.FOO,
    BAR: process.env.BAR,
}

const app = express()
const injectEnv = injectPayload(payload, resolveIndex)
/**
* Injects payload into `window.env` on `index.html`
*/
app.use('/', injectEnv)
```

```javascript
// App.js
import React from 'react'
import { resolveEnv } from 'react-process-env'

export default () => {
    /**
    * Reads window.env.FOO on `express` (production), or process.env.FOO on `react-scripts start` (development)
    */
    const myFoo = resolveEnv('FOO');
}

```

### security considerations

#### :warning: Do not pass `process.env` directly as payload

It's a security risk. If you pass `process.env` directly, it will throw an assertion error.

#### Cross-site scripting (XSS) attack
- Scalar values only - anything else will throw an assertion error.
- Non-scalar keys will automatically be cast to strings.
- The payload will be encoded into base64 before injecting into page to prevent malicious payloads from executing.
