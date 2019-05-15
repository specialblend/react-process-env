/* eslint-disable camelcase */
import { resolveEnv } from './resolve';

global.env = {};

describe('pulls expected prop', () => {
    test('when process.env[prop] is set, and window.env[prop] is set', () => {
        global.env = {};
        process.env.__test__zxcvbnm = 'test_value_process';
        global.env.__test__zxcvbnm = 'test_value_window';
        expect(resolveEnv('__test__zxcvbnm')).toBe('test_value_process');
    });
    test('when process.env[prop] is not set, but window.env[prop] is set', () => {
        global.env.__test__qwertyuiop = 'test_value_window';
        expect(resolveEnv('__test__qwertyuiop')).toBe('test_value_window');
    });
    test('when process.env[prop] is set, and window.env[prop] is not set', () => {
        Reflect.deleteProperty(global, 'env');
        process.env.__test__asdfg = 'test_value_process';
        expect(resolveEnv('__test__asdfg')).toBe('test_value_process');
    });
    test('when neither window.env[prop] or process.env[prop] is set', () => {
        expect(resolveEnv('__test__qawsedrftgyhuji')).toBeUndefined();
    });
});
