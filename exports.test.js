import * as moduleES from './dist/index.esm';
import * as moduleCJS from './dist/index.cjs';
const moduleUMD = require('./dist/index.umd');

const functions = ['inject', 'injectScript', 'renderScript', 'resolve'];

describe('exports are importable', () => {
    test.each(functions)('%p', func => {
        expect(moduleUMD[func]).toBeFunction();
        expect(moduleES[func]).toBeFunction();
        expect(moduleCJS[func]).toBeFunction();
    });
});
