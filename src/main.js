'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var cheerio = _interopDefault(require('cheerio'));
var R = require('ramda');

const toBase64 = data => Buffer.from(data).toString('base64');
const encodeData = data => toBase64(JSON.stringify(data));

const renderScript = data => `<script>window.env=JSON.parse(atob('${encodeData(data)}'))</script>`;

const injectScript = (body, payload) => {
    const script = renderScript(payload);
    const $ = cheerio.load(body);
    $('head').append(script);
    return $.html();
};

const inject = (payload, resolver) =>
    async(req, res) => {
        const body = await resolver();
        return res.send(injectScript(body, payload));
    };

const resolve = prop =>
    R.either(
        R.path(['window', 'env', prop]),
        R.path(['process', 'env', prop]),
    )({ process, window: global });

exports.inject = inject;
exports.injectScript = injectScript;
exports.renderScript = renderScript;
exports.resolve = resolve;
