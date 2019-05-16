/* eslint-disable no-undefined */

import * as R from 'ramda';
import { resolveEnv } from './resolve';

const window = global;
window.env = {};

const VALUE_PROCESS = 'VALUE_PROCESS';
const VALUE_WINDOW = 'VALUE_WINDOW';
const TEST_KEY = 'TEST_KEY';

const generalTests = R.map(({ name, expectation, context }) => [R.join(' - ', [name, expectation]), { expectation, context }], [
    {
        name: 'context.process.env[prop] is set',
        context: {
            process: {
                env: {
                    [TEST_KEY]: VALUE_PROCESS,
                },
            },
        },
        expectation: VALUE_PROCESS,
    },

    {
        name: 'context.process.env[prop] is empty, context.window.env[prop] is set',
        context: {
            process: {
                env: {
                    [TEST_KEY]: null,
                },
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
        name: 'context.process is not set, context.window is set, context.window.env is not set',
        context: {
            window: {},
        },
        expectation: undefined,
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
        expectation: undefined,
    },
]);

const withContextTests = R.map(({ name, ...props }) => [name, props], [
    {
        name: 'context is empty object',
        context: {},
        expectation: undefined,
    },
    {
        name: 'context is null',
        context: {},
        expectation: undefined,
    },
    {
        name: 'context.process.env[prop] is empty, context.window.env[prop] is empty',
        context: {
            process: {
                env: {
                    [TEST_KEY]: null,
                },
            },
            window: {
                env: {
                    [TEST_KEY]: null,
                },
            },
        },
        expectation: undefined,
    },
]);

/**
 * Reflect provided context onto global window and process
 * @param {Object} context context
 * @return {void}
 */
const reflectSuperContext = context => {
    Reflect.deleteProperty(process.env, TEST_KEY);
    Reflect.deleteProperty(window, 'env');
    if (context.process) {
        process.env = context.process.env;
    }
    if (context.window) {
        if (context.window.env) {
            window.env = context.window.env;
        }
    }
};

describe('resolves expected prop', () => {
    describe('when passing context', () => {
        test.each(generalTests)('%p - %p', (name, { expectation, context }) => {
            expect(resolveEnv(TEST_KEY, context)).toBe(expectation);
        });
        test.each(withContextTests)('%p - %p', (name, { expectation, context }) => {
            expect(resolveEnv(TEST_KEY, context)).toBe(expectation);
        });
    });
    describe('with supercontext', () => {
        test.each(generalTests)('%p - %p', (name, { expectation, context }) => {
            reflectSuperContext(context);
            expect(resolveEnv(TEST_KEY)).toBe(expectation);
        });
    });
});
