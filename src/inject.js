import cheerio from 'cheerio';
import { encodeData } from './common';

export const renderScript = data => `<script>window.env=JSON.parse(atob('${encodeData(data)}'))</script>`;

/**
 * Render payload into <script> tag
 * @param {Object} payload: payload
 * @return {String}: <script> tag
 */
export const renderScript = payload => `<script>window.env=JSON.parse(atob('${encodeData(payload)}'))</script>`;

/**
 * Inject rendered script tag into <head> of HTML body
 * @param {String} body: HTML body
 * @param {Object} payload: payload
 * @return {String}: HTML body with <script> tag
 */
export const injectScript = (body, payload) => {
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
export const injectPayload = (payload, resolver) =>
    async(req, res) => {
        const body = await resolver();
        return res.send(injectScript(body, payload));
    };
