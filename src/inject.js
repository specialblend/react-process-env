import * as R from 'ramda';
import cheerio from 'cheerio';
import assert from 'assert';
import {
    encodeData,
    ERROR_INJECT_NON_SCALAR_PAYLOAD,
    ERROR_INJECT_PROCESS_ENV,
    hasNonScalarValues,
    isProcessEnv,
    wrapScript,
} from './common';

/**
 * Check payload before injecting
 * @param {object} payload payload
 * @return {*} payload
 */
export const checkPayload = payload => {
    assert(!isProcessEnv(payload), ERROR_INJECT_PROCESS_ENV);
    assert(!hasNonScalarValues(payload), ERROR_INJECT_NON_SCALAR_PAYLOAD);
    return payload;
};

/**
 * Render payload into `script` tag
 * @type {function}
 * @param {object} payload payload
 * @return {string} `script` tag
 */
export const renderScript = R.compose(wrapScript, payload => `window.env=JSON.parse(atob('${payload}'))`, encodeData, checkPayload);

/**
 * Inject rendered `script` tag into `head` of HTML body
 * @param {object} payload payload
 * @param {string} body HTML body
 * @return {string} HTML body with `script` tag
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
 * @param {object} payload payload
 * @param {function} resolver async callback to resolve the HTML body
 * @return {function(*, *): (boolean | void)} express callback
 */
export const injectPayload = (payload, resolver) => {
    checkPayload(payload);
    return async(req, res) => {
        const body = await resolver();
        return res.send(injectScript(payload, body));
    };
};
