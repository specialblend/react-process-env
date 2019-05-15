import * as R from 'ramda';
import cheerio from 'cheerio';
import assert from 'assert';
import { encodeData, hasNonScalarValues, isProcessEnv, prependString } from './common';

export const ERROR_INJECT_PROCESS_ENV = '!! DO NOT DIRECTLY PASS `process.env` -- THIS IS A SECURITY RISK !!';
export const ERROR_INJECT_NON_SCALAR_PAYLOAD = 'Non-scalar value(s) found in payload';

/**
 * Wraps body with <script></script>
 */
export const wrapScript = R.compose(R.concat('<script>'), prependString('</script>'));

/**
 * Assert payload !== process.env
 * @param {Object} payload: payload
 * @return {*}: payload
 */
export const checkPayload = payload => {
    assert(!isProcessEnv(payload), ERROR_INJECT_PROCESS_ENV);
    assert(!hasNonScalarValues(payload), ERROR_INJECT_NON_SCALAR_PAYLOAD);
    return payload;
};

/**
 * Render payload into <script> tag
 * @param {Object} payload: payload
 * @return {String}: <script> tag
 */
export const renderScript = R.compose(wrapScript, payload => `window.env=JSON.parse(atob('${payload}'))`, encodeData, checkPayload);

/**
 * Inject rendered script tag into <head> of HTML body
 * @param {Object} payload: payload
 * @param {String} body: HTML body
 * @return {String}: HTML body with <script> tag
 */
export const injectScript = (payload, body) => {
    checkPayload(payload);
    const script = renderScript(payload);
    const $ = cheerio.load(body);
    $('head').append(script);
    return $.html();
};

/**
 * Create express callback that injects script into resolved HTML body
 * @param {Object} payload: payload
 * @param {Function} resolver: async callback to resolve the HTML body
 * @return {function(*, *): (boolean | void)}: express callback
 */
export const injectPayload = (payload, resolver) => {
    checkPayload(payload);
    return async(req, res) => {
        const body = await resolver();
        return res.send(injectScript(payload, body));
    };
};
