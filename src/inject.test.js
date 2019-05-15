import { fromBase64, encodeData, decodeData } from './common';
import { inject, injectScript, renderScript } from './inject';
import xssPayloads from '../__mocks__/xss-payloads';

const safePayloads = {
    FOO_BAR: '__TEST_FOO_BAR__',
    FALCON_HEAVY: 'zwexrctvybunimo,p.[;op;ilkujyhtgrefr',
    theySayItDontBeLikeItIs: 'BUT IT DO!!!!!!!!',
};

const payload = {
    ...safePayloads,
    ...xssPayloads,
};

describe('encode', () => {
    test('works as expected', () => {
        const encoded = encodeData(payload);
        const decoded = fromBase64(encoded);
        const parsed = JSON.parse(decoded);
        expect(parsed).toMatchObject(payload);
    });
});

describe('renderScript', () => {
    const script = renderScript(payload);
    test('returns string', () => {
        expect(script).toBeString();
    });
    test('returns expected script', () => {
        const query = /<script>window.env=JSON.parse\(atob\('((?:[A-Za-z0-9+\/=])+)'\)\)<\/script>/;
        expect(script).toMatch(query);
        const [, data] = query.exec(script);
        const parsed = decodeData(data);
        expect(parsed).toMatchObject(payload);
    });
});

describe('injectScript', () => {
    const body = '<html><head></head><body>Hello, world!</body></html>';
    const page = injectScript(body, payload);
    test('returns string', () => {
        expect(page).toBeString();
    });
    test('works as expected', () => {
        expect(page).toBe(`<html><head>${renderScript(payload)}</head><body>Hello, world!</body></html>`);
    });
});

describe('inject', () => {
    test('works as expected', async() => {
        const body = '<html><head></head><body>Hello, world!</body></html>';
        const page = injectScript(body, payload);
        const resolve = () => Promise.resolve(body);
        const res = { send: jest.fn() };
        const next = jest.fn();
        const injectEnv = inject(payload, resolve);
        await injectEnv(null, res, next);
        expect(res.send).toHaveBeenCalledWith(page);
        expect(next).not.toHaveBeenCalled();
    });
});
