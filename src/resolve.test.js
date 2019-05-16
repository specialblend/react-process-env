/* eslint-disable camelcase */
import { resolveEnv } from './resolve';

const window = global;
window.env = {};

describe('pulls expected prop', () => {
    describe('with default context', () => {
        test('when process.env[prop] is set, and window.env[prop] is set', () => {
            window.env = {};
            process.env.__test__zxcvbnm = 'test_value_process';
            window.env.__test__zxcvbnm = 'test_value_window';
            expect(resolveEnv('__test__zxcvbnm')).toBe('test_value_process');
        });
        test('when process.env[prop] is not set, but window.env[prop] is set', () => {
            window.env.__test__qwertyuiop = 'test_value_window';
            expect(resolveEnv('__test__qwertyuiop')).toBe('test_value_window');
        });
        test('when process.env[prop] is set, and window.env[prop] is not set', () => {
            Reflect.deleteProperty(window, 'env');
            process.env.__test__asdfg = 'test_value_process';
            expect(resolveEnv('__test__asdfg')).toBe('test_value_process');
        });
        test('when neither window.env[prop] or process.env[prop] is set', () => {
            expect(resolveEnv('__test__qawsedrftgyhuji')).toBeUndefined();
        });
    });
    describe('when passing context', () => {
        const context = {
            window: {
                env: {},
            },
            process: {
                env: {},
            },
        };
        test('when process.env[prop] is set, and window.env[prop] is set', () => {
            context.window.env = {};
            context.process.env.__test__zxcvbnm = 'test_value_process';
            context.window.env.__test__zxcvbnm = 'test_value_window';
            expect(resolveEnv('__test__zxcvbnm', context)).toBe('test_value_process');
        });
        test('when process.env[prop] is not set, but window.env[prop] is set', () => {
            context.window.env.__test__qwertyuiop = 'test_value_window';
            expect(resolveEnv('__test__qwertyuiop', context)).toBe('test_value_window');
        });
        test('when process.env[prop] is set, and window.env[prop] is not set', () => {
            Reflect.deleteProperty(context.window, 'env');
            context.process.env.__test__asdfg = 'test_value_process';
            expect(resolveEnv('__test__asdfg', context)).toBe('test_value_process');
        });
        test('when neither window.env[prop] or process.env[prop] is set', () => {
            expect(resolveEnv('__test__qawsedrftgyhuji', context)).toBeUndefined();
        });
    });
});
