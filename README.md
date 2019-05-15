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
const { inject } = require('react-process-env')

const resolveIndex = memoize(() => fs.readFile(path.join(__dirname, 'index.html')))

const payload = {
    FOO: process.env.FOO,
    BAR: process.env.BAR,
}

const app = express()
app.use(inject(payload, resolveIndex))
```

```javascript
// App.js
import React from 'react'
import { resolve } from 'react-process-env'

export default () => {
    const myFoo = resolve('FOO');
}

```
