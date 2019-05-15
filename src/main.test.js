import render from './main';
import { fromBase64, encodeData, decodeData, renderPage, renderScript } from './common';
import xssPayloads from '../__mocks__/xss-payloads';

const safePayloads = {
    FOO_BAR: '__TEST_FOO_BAR__',
    FALCON_HEAVY: 'zwexrctvybunimo,p.[;op;ilkujyhtgrefr',
    theySayItDontBeLikeItIs: 'BUT IT DO!!!!!!!!',
};

const mixedPayloads = {
    ...safePayloads,
    ...xssPayloads,
};

describe('encode', () => {
    test('works as expected', () => {
        const encoded = encodeData(mixedPayloads);
        const decoded = fromBase64(encoded);
        const parsed = JSON.parse(decoded);
        expect(parsed).toMatchObject(mixedPayloads);
    });
});

describe('renderScript', () => {
    const script = renderScript(mixedPayloads);
    test('returns string', () => {
        expect(script).toBeString();
    });
    test('returns expected script', () => {
        const query = /<script>window.env=JSON.parse\(atob\('((?:[A-Za-z0-9+\/=])+)'\)\)<\/script>/;
        expect(script).toMatch(query);
        const [, data] = query.exec(script);
        const parsed = decodeData(data);
        expect(parsed).toMatchObject(mixedPayloads);
    });
});

describe('renderPage', () => {
    const body = '<html><head></head><body>Hello, world!</body></html>';
    const page = renderPage(mixedPayloads, body);
    test('returns string', () => {
        expect(page).toBeString();
    });
    test('works as expected', () => {
        expect(page).toBe(`<html><head>${renderScript(mixedPayloads)}</head><body>Hello, world!</body></html>`);
    });
});

describe('render middleware', () => {
    const body = '<html><head></head><body>Hello, world!</body></html>';
    const res = { body, send: jest.fn() };
    test('works as expected', () => {
        render(mixedPayloads)(null, res, null);
        expect(res.send).toHaveBeenCalledWith(`<html><head>${renderScript(mixedPayloads)}</head><body>Hello, world!</body></html>`);
    });
});
