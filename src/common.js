import cheerio from 'cheerio';

export const toBase64 = data => Buffer.from(data).toString('base64');
export const fromBase64 = data => Buffer.from(data, 'base64').toString('ascii');
export const encodeData = data => toBase64(JSON.stringify(data));
export const decodeData = data => JSON.parse(fromBase64(data));
export const renderScript = data => `<script>window.env=JSON.parse(atob('${encodeData(data)}'))</script>`;
export const renderPage = (payload, body) => {
    const script = renderScript(payload);
    const $ = cheerio.load(body);
    $('head').append(script);
    return $.html();
};
