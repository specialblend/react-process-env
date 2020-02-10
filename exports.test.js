import _inject from './lib';
import * as _module from './lib';
const functions = ['injectScript', 'renderScript', 'resolve'];

describe('compiled module', () => {
    test('exports default function', () => {
        expect(_inject).toBeFunction();

    });
    test.each(functions)('exports function %p', funcName => {
        expect(_module[funcName]).toBeFunction();
    });
});
