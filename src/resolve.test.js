/* eslint-disable camelcase */
import { resolveEnv } from './resolve';

global.env = {};

describe('pulls expected prop', () => {
    test('when window.env[prop] is set', () => {
        global.env.__test__qwertyuiop = 'test_value_window';
        process.env.__test__qwertyuiop = 'test_value_process';
        expect(resolveEnv('__test__qwertyuiop')).toBe('test_value_window');
    });
    test('when window.env[prop] is not set', () => {
        global.env = {};
        process.env.__test__zxcvbnm = 'test_value_process';
        expect(resolveEnv('__test__zxcvbnm')).toBe('test_value_process');
    });
    test('when window.env is not set', () => {
        Reflect.deleteProperty(global, 'env');
        process.env.__test__asdfg = 'test_value_process';
        expect(resolveEnv('__test__asdfg')).toBe('test_value_process');
    });
    test('when neither window.env[prop] or process.env[prop] is set', () => {
        expect(resolveEnv('__test__qawsedrftgyhuji')).toBeUndefined();
    });
});
