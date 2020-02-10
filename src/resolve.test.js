import { join, map } from 'ramda';

import resolve from './resolve';

const VALUE_PROCESS = 'VALUE_PROCESS';
const VALUE_WINDOW = 'VALUE_WINDOW';
const TEST_KEY = 'TEST_KEY';

const generalTests = map(({ name, expectation, context }) => [join(' - ', [name, expectation]), { expectation, context }], [
    {
        name: 'context.process.env[prop] is empty, context.window.env[prop] is set',
        context: {
            processEnv: {
                [TEST_KEY]: '',
            },
            window: {
                env: {
                    [TEST_KEY]: VALUE_WINDOW,
                },
            },
        },
        expectation: VALUE_WINDOW,
    },
    {
        name: 'context.process.env[prop] is set',
        context: {
            processEnv: {
                [TEST_KEY]: VALUE_PROCESS,
            },
        },
        expectation: VALUE_PROCESS,
    },
    {
        name: 'context.process is not set, context.window is set, context.window.env is not set',
        context: {
            window: {},
        },
        expectation: null,
    },
    {
        name: 'context.process is not set, context.window is set, context.window.env is set, context.window.env[prop] is set',
        context: {
            window: {
                env: {
                    [TEST_KEY]: VALUE_WINDOW,
                },
            },
        },
        expectation: VALUE_WINDOW,
    },
    {
        name: 'context.process is not set, context.window is set, context.window.env is set, context.window.env[prop] is not set',
        context: {
            window: {
                env: {},
            },
        },
        expectation: null,
    },
]);

const withContextTests = map(({ name, ...props }) => [name, props], [
    {
        name: 'context is empty object',
        context: {},
        expectation: null,
    },
    {
        name: 'context is null',
        context: {},
        expectation: null,
    },
    {
        name: 'context.process.env[prop] is empty, context.window.env[prop] is empty',
        context: {
            processEnv: {
                [TEST_KEY]: null,
            },
            window: {
                env: {
                    [TEST_KEY]: null,
                },
            },
        },
        expectation: null,
    },
]);


/**
 * Reflect provided context onto global window and process
 * @param {Object} context context
 * @return {void}
 */
function reflectSuperContext(context) {
    Reflect.deleteProperty(process.env, TEST_KEY);
    Reflect.deleteProperty(global, 'env');
    if (context.processEnv) {
        Object.assign(process.env, context.processEnv);
    }
    if (context.window) {
        if (context.window.env) {
            global.env = context.window.env;
        }
    }
}

describe('resolves expected prop', () => {
    describe('when passing context', () => {
        test.each(generalTests)('%p - %p', (name, { expectation, context }) => {
            expect(resolve(TEST_KEY, context.processEnv, context.window)).toBe(expectation);
        });
        test.each(withContextTests)('%p - %p', (name, { expectation, context }) => {
            expect(resolve(TEST_KEY, context.processEnv, context.window)).toBe(expectation);
        });
    });
    describe('with supercontext', () => {
        test.each(generalTests)('%p - %p', (name, { expectation, context }) => {
            reflectSuperContext(context);
            expect(resolve(TEST_KEY)).toBe(expectation);
        });
    });
});
