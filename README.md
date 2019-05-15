### react-process-env

Render an object (e.g. a subset of `process.env`) as an html `head` `<script>` that maps its data to `window.env`, useful for passing data from `process.env` to your React app served with express.

### install

`npm install react-process-env`

### use

```javascript
const fs = require('fs')
const path = require('path')
const express = require('express')
const renderEnvrionment = require('react-process-env')

const app = express()
app.use('/', renderEnvrionment)
```
