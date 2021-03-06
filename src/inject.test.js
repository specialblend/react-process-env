import * as R from 'ramda';

import xssPayloads from '../__mocks__/xss-payloads';
import inject, {
    checkPayload, decodeData, encodeData, ERROR_INJECT_NON_SCALAR_PAYLOAD, ERROR_INJECT_PROCESS_ENV, fromBase64,
    injectScript,
    renderScript,
} from './index';

const safePayloads = {
    FOO_BAR: '__TEST_FOO_BAR__',
    FALCON_HEAVY: 'zwexrctvybunimo,p.[;op;ilkujyhtgrefr',
    theySayItDontBeLikeItIs: 'BUT IT DO!!!!!!!!',
};

const payload = {
    ...safePayloads,
    ...xssPayloads,
};

beforeAll(() => {
    process.env.TEST_FOO_BAR = 'test_foo_bar';
    process.env.TEST_FAZ_BAZ = 'test_faz_baz';
    process.env.TEST_ALPHA_BRAVO = 'test_alpha_bravo';
    process.env.TEST_CHARLIE_DELTA = 'test_charlie_delta';
});

describe('encode', () => {
    test('works as expected', () => {
        const encoded = encodeData(payload);
        const decoded = fromBase64(encoded);
        const parsed = JSON.parse(decoded);
        expect(parsed).toMatchObject(payload);
    });
});

describe('checkPayload', () => {
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
        test('when payload has non-scalar values', () => {
            expect.assertions(1);
            const nonScalarPayload = {
                testFunc: () => {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
                TEST_FUNC() {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
            };
            try {
                checkPayload({
                    ...payload,
                    ...nonScalarPayload,
                });
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_NON_SCALAR_PAYLOAD);
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
    describe('throws expected assertion', () => {
        test('when payload is process.env', () => {
            expect.assertions(1);
            try {
                renderScript(process.env);
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_PROCESS_ENV);
            }
        });
        test('when payload has non-scalar values', () => {
            expect.assertions(1);
            const nonScalarPayload = {
                testFunc: () => {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
                TEST_FUNC() {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
            };
            try {
                renderScript({
                    ...payload,
                    ...nonScalarPayload,
                });
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_NON_SCALAR_PAYLOAD);
            }
        });
    });
});

describe('injectScript', () => {
    const body = '<html><head></head><body>Hello, world!</body></html>';
    const page = injectScript(payload, body);
    test('returns string', () => {
        expect(page).toBeString();
    });
    test('works as expected', () => {
        expect(page).toBe(`<html><head>${renderScript(payload)}</head><body>Hello, world!</body></html>`);
    });
    describe('throws expected assertion', () => {
        test('when payload is process.env', () => {
            expect.assertions(1);
            try {
                injectScript(process.env, body);
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_PROCESS_ENV);
            }
        });
        test('when payload has non-scalar values', () => {
            expect.assertions(1);
            const nonScalarPayload = {
                testFunc: () => {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
                TEST_FUNC() {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
            };
            try {
                injectScript({
                    ...payload,
                    ...nonScalarPayload,
                }, body);
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_NON_SCALAR_PAYLOAD);
            }
        });
    });
});

describe('inject', () => {
    test('works as expected', async() => {
        const body = '<html lang="en"><head></head><body>Hello, world!</body></html>';
        const page = injectScript(payload, body);
        const resolve = R.always(Promise.resolve(body));
        const res = { send: jest.fn() };
        const next = jest.fn();
        const injectEnv = inject(payload, resolve);
        await injectEnv(null, res, next);
        expect(res.send).toHaveBeenCalledWith(page);
        expect(next).not.toHaveBeenCalled();
    });
    describe('throws expected assertion', () => {
        test('when payload is process.env', () => {
            expect.assertions(1);
            try {
                inject(process.env);
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_PROCESS_ENV);
            }
        });
        test('when payload has non-scalar values', () => {
            expect.assertions(1);
            const nonScalarPayload = {
                testFunc: () => {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
                TEST_FUNC() {
                    console.alert('kiumjnyhtbgrvfecdbnm,./oops!wertvybuniop');
                },
            };
            try {
                inject({
                    ...payload,
                    ...nonScalarPayload,
                });
            } catch (err) {
                expect(err.message).toMatch(ERROR_INJECT_NON_SCALAR_PAYLOAD);
            }
        });
    });
});
