const _module = require('./lib');
const functions = ['inject', 'injectScript', 'renderScript', 'resolve'];

describe('compiled module', () => {
    test('exports default function', () => {
        expect(_module.default).toBeFunction();

    });
    test.each(functions)('exports function %p', funcName => {
        expect(_module[funcName]).toBeFunction();
    });
});
