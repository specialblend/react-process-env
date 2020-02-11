import _inject from './lib';
import * as _imported from './lib';
const functions = ['injectScript', 'renderScript', 'resolve'];

const _required = require('./lib');

describe('imported module', () => {
    test('exports default function', () => {
        expect(_inject).toBeFunction();

    });
    test.each(functions)('exports function %p', funcName => {
        expect(_imported[funcName]).toBeFunction();
    });
});


describe('_required module', () => {
    test('exports default function', () => {
        expect(_required.default).toBeFunction();

    });
    test.each(functions)('exports function %p', funcName => {
        expect(_required[funcName]).toBeFunction();
    });
});
