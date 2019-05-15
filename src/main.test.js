import injectPayload from './main';
import { fromBase64, encodeData, decodeData, renderPage, renderScript } from './common';
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

describe('renderPage', () => {
    const body = '<html><head></head><body>Hello, world!</body></html>';
    const page = renderPage(payload, body);
    test('returns string', () => {
        expect(page).toBeString();
    });
    test('works as expected', () => {
        expect(page).toBe(`<html><head>${renderScript(payload)}</head><body>Hello, world!</body></html>`);
    });
});

describe('injectPayload', () => {
    test('works as middleware', () => {
        const body = '<html><head></head><body>Hello, world!</body></html>';
        const res = { body, send: jest.fn(), next: jest.fn() };
        const next = jest.fn();
        const inject = injectPayload(payload);
        inject(null, res, next);
        expect(res.body).toBe(renderPage(payload, body));
        expect(next).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
    test('works as resolver', async() => {
        const body = '<html><head></head><body>Hello, world!</body></html>';
        const resolve = () => Promise.resolve(body);
        const res = { send: jest.fn() };
        const next = jest.fn();
        const inject = injectPayload(payload, resolve);
        await inject(null, res, next);
        expect(res.send).toHaveBeenCalledWith(renderPage(payload, body));
        expect(next).not.toHaveBeenCalled();
    });
    test('works as passthru', async() => {
        const res = { send: jest.fn() };
        const next = jest.fn();
        const inject = injectPayload(payload);
        await inject(null, res, next);
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
