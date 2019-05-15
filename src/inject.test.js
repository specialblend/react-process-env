import * as R from 'ramda';
import { fromBase64, encodeData, decodeData } from './common';
import { checkPayload, ERROR_INJECT_PROCESS_ENV, injectPayload, injectScript, renderScript } from './inject';
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

describe('checkPayload', () => {
    beforeAll(() => {
        process.env.TEST_FOO_BAR = 'test_foo_bar';
        process.env.TEST_FAZ_BAZ = 'test_faz_baz';
        process.env.TEST_ALPHA_BRAVO = 'test_alpha_bravo';
        process.env.TEST_CHARLIE_DELTA = 'test_charlie_delta';
    });
    describe('returns payload', () => {
        test('on normal object', () => {
            expect(checkPayload(payload)).toBe(payload);
        });
        test('on subset of process.env', () => {
            const subset = R.pick(['TEST_FOO_BAR', 'TEST_ALPHA_BRAVO'], process.env);
            expect(checkPayload(subset)).toBe(subset);
        });
        test('on clone of process.env', () => {
            const subset = { ...process.env };
            expect(checkPayload(subset)).toBe(subset);
        });
    });
    describe('throws assertion', () => {
        test('when payload is process.env', () => {
            expect.assertions(1);
            try {
                checkPayload(process.env);
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_PROCESS_ENV);
            }
        });
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

describe('injectPayload', () => {
    test('works as expected', async() => {
        const body = '<html><head></head><body>Hello, world!</body></html>';
        const page = injectScript(body, payload);
        const resolve = () => Promise.resolve(body);
        const res = { send: jest.fn() };
        const next = jest.fn();
        const injectEnv = injectPayload(payload, resolve);
        await injectEnv(null, res, next);
        expect(res.send).toHaveBeenCalledWith(page);
        expect(next).not.toHaveBeenCalled();
    });
});
