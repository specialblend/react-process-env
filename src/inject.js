import cheerio from 'cheerio';
import { encodeData } from './common';

export const renderScript = data => `<script>window.env=JSON.parse(atob('${encodeData(data)}'))</script>`;

export const injectScript = (body, payload) => {
    const script = renderScript(payload);
    const $ = cheerio.load(body);
    $('head').append(script);
    return $.html();
};

export const inject = (payload, resolver) =>
    async(req, res) => {
        const body = await resolver();
        return res.send(injectScript(body, payload));
    };
