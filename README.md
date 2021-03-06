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
## Members

<dl>
<dt><a href="#encodeData">encodeData</a> ⇒ <code>string</code></dt>
<dd><p>Stringify and encode payload into base64</p>
</dd>
<dt><a href="#ERROR_INJECT_PROCESS_ENV">ERROR_INJECT_PROCESS_ENV</a> : <code>string</code></dt>
<dd><p>Assertion error thrown when passing <code>process.env</code> directly into any of the inject methods</p>
</dd>
<dt><a href="#ERROR_INJECT_NON_SCALAR_PAYLOAD">ERROR_INJECT_NON_SCALAR_PAYLOAD</a> : <code>string</code></dt>
<dd><p>Assertion error thrown when passing a non-scalar value into any of the inject methods</p>
</dd>
<dt><a href="#renderScript">renderScript</a> ⇒ <code>string</code></dt>
<dd><p>Render payload into <code>script</code> tag</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#wrapScript">wrapScript</a> : <code>function</code></dt>
<dd><p>Wraps body with <code>script</code> tag</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#toBase64">toBase64(payload)</a> ⇒ <code>string</code></dt>
<dd><p>Encode payload into base64</p>
</dd>
<dt><a href="#fromBase64">fromBase64(payload)</a> ⇒ <code>string</code></dt>
<dd><p>Decode payload from base64 to ascii</p>
</dd>
<dt><a href="#isProcessEnv">isProcessEnv(payload)</a> ⇒ <code>boolean</code></dt>
<dd><p>Returns true is payload is process.env</p>
</dd>
<dt><a href="#checkPayload">checkPayload(payload)</a> ⇒ <code>*</code></dt>
<dd><p>Check payload before injecting</p>
</dd>
<dt><a href="#resolve">resolve(property, processEnv, window)</a> ⇒ <code>*</code></dt>
<dd><p>Resolve property from <code>process.env</code> (<code>react-scripts</code>/development), or <code>window.env</code> (<code>express</code>/production)</p>
</dd>
<dt><a href="#injectScript">injectScript(payload, body)</a> ⇒ <code>string</code></dt>
<dd><p>Inject rendered <code>script</code> tag into <code>head</code> of HTML body</p>
</dd>
<dt><a href="#inject">inject(payload, resolver)</a> ⇒ <code>function</code></dt>
<dd><p>Create express callback that injects script into resolved HTML body</p>
</dd>
</dl>

<a name="encodeData"></a>

## encodeData ⇒ <code>string</code>
Stringify and encode payload into base64

**Kind**: global variable  
**Returns**: <code>string</code> - encoded payload  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="ERROR_INJECT_PROCESS_ENV"></a>

## ERROR\_INJECT\_PROCESS\_ENV : <code>string</code>
Assertion error thrown when passing `process.env` directly into any of the inject methods

**Kind**: global variable  
<a name="ERROR_INJECT_NON_SCALAR_PAYLOAD"></a>

## ERROR\_INJECT\_NON\_SCALAR\_PAYLOAD : <code>string</code>
Assertion error thrown when passing a non-scalar value into any of the inject methods

**Kind**: global variable  
<a name="renderScript"></a>

## renderScript ⇒ <code>string</code>
Render payload into `script` tag

**Kind**: global variable  
**Returns**: <code>string</code> - `script` tag  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="wrapScript"></a>

## wrapScript : <code>function</code>
Wraps body with `script` tag

**Kind**: global constant  

| Param | Type |
| --- | --- |
| body | <code>body</code> | 

<a name="toBase64"></a>

## toBase64(payload) ⇒ <code>string</code>
Encode payload into base64

**Kind**: global function  
**Returns**: <code>string</code> - base64 payload  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="fromBase64"></a>

## fromBase64(payload) ⇒ <code>string</code>
Decode payload from base64 to ascii

**Kind**: global function  
**Returns**: <code>string</code> - ascii payload  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="isProcessEnv"></a>

## isProcessEnv(payload) ⇒ <code>boolean</code>
Returns true is payload is process.env

**Kind**: global function  
**Returns**: <code>boolean</code> - check  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="checkPayload"></a>

## checkPayload(payload) ⇒ <code>\*</code>
Check payload before injecting

**Kind**: global function  
**Returns**: <code>\*</code> - payload  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |

<a name="resolve"></a>

## resolve(property, processEnv, window) ⇒ <code>\*</code>
Resolve property from `process.env` (`react-scripts`/development), or `window.env` (`express`/production)

**Kind**: global function  
**Returns**: <code>\*</code> - value of the resolved property  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | name of property to resolve |
| processEnv | <code>object</code> | process.env |
| window | <code>object</code> | global/window |

<a name="injectScript"></a>

## injectScript(payload, body) ⇒ <code>string</code>
Inject rendered `script` tag into `head` of HTML body

**Kind**: global function  
**Returns**: <code>string</code> - HTML body with `script` tag  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |
| body | <code>string</code> | HTML body |

<a name="inject"></a>

## inject(payload, resolver) ⇒ <code>function</code>
Create express callback that injects script into resolved HTML body

**Kind**: global function  
**Returns**: <code>function</code> - express callback  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>object</code> | payload |
| resolver | <code>function</code> | async callback to resolve the HTML body |

