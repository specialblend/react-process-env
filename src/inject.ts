import assert from 'assert';
import cheerio from 'cheerio';
import {all, complement, compose, concat, flip, is, unary, valuesIn} from 'ramda';


type Callable = Function | ((... args: any[]) => any)

const prependString = flip(concat);

/**
 * Encode payload into base64
 * @param {object} payload payload
 * @return {string} base64 payload
 */
export const toBase64 = (payload: any): string => Buffer.from(payload).toString('base64');

/**
 * Decode payload from base64 to ascii
 * @param {object} payload payload
 * @return {string} ascii payload
 */
export const fromBase64 = (payload: any): string => Buffer.from(payload, 'base64').toString('ascii');

/**
 * Stringify and encode payload into base64
 * @param {object} payload payload
 * @return {string} encoded payload
 */
export const encodeData = compose(toBase64, unary(JSON.stringify));
export const decodeData = compose(JSON.parse, fromBase64);

/**
 * Returns true is payload is process.env
 * @param {object} payload payload
 * @return {boolean} check
 */
const isProcessEnv = (payload: any): boolean => payload === process.env;
const hasScalarValues = compose(all(is(String)), valuesIn);
const hasNonScalarValues = complement(hasScalarValues);

/**
 * Wraps body with `script` tag
 * @type {function}
 * @param {body} body
 */
const wrapScript = compose(concat('<script>'), prependString('</script>'));

/**
 * Assertion error thrown when passing `process.env` directly into any of the inject methods
 * @type {string}
 */
export const ERROR_INJECT_PROCESS_ENV = '!! DO NOT DIRECTLY PASS `process.env` -- THIS IS A SECURITY RISK !!';

/**
 * Assertion error thrown when passing a non-scalar value into any of the inject methods
 * @type {string}
 */
export const ERROR_INJECT_NON_SCALAR_PAYLOAD = 'Non-scalar value(s) found in payload';

/**
 * Check payload before injecting
 * @param {object} payload payload
 * @return {*} payload
 */
export function checkPayload(payload: Record<string, any>): Record<string, any> {
    assert(!isProcessEnv(payload), ERROR_INJECT_PROCESS_ENV);
    assert(!hasNonScalarValues(payload), ERROR_INJECT_NON_SCALAR_PAYLOAD);
    return payload;
}

const asWindowEnv = (payload: string): string => `window.env=JSON.parse(atob('${payload}'))`;

/**
 * Render payload into `script` tag
 * @type {function}
 * @param {object} payload payload
 * @return {string} `script` tag
 */
export const renderScript = compose(wrapScript, asWindowEnv, encodeData, checkPayload);

/**
 * Inject rendered `script` tag into `head` of HTML body
 * @param {object} payload payload
 * @param {string} body HTML body
 * @return {string} HTML body with `script` tag
 */
export function injectScript(payload: Record<string, any>, body: string) {
    checkPayload(payload);
    const script: string = renderScript(payload);
    const $ = cheerio.load(body);
    $('head').append(script);
    return $.html();
}

/**
 * Create express callback that injects script into resolved HTML body
 * @param {object} payload payload
 * @param {function} resolver async callback to resolve the HTML body
 * @return {function(*, *): (boolean | void)} express callback
 */
export default function inject(payload: Record<string, any>, resolver:Callable): Function {
    checkPayload(payload);
    return async function handleInjection(req: any, res: { send: Callable }): Promise<any> {
        const body = await resolver();
        return res.send(injectScript(payload, body));
    };
}

