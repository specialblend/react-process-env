// import * as moduleES from './dist/index.esm';
// import * as moduleCJS from './dist/index.cjs';
// const moduleUMD = require('./dist/index.umd');
const pkg = require('./build/index');

const functions = ['injectPayload', 'injectScript', 'renderScript', 'resolveEnv'];

describe('exports are importable', () => {
    test.each(functions)('%p', func => {
        // expect(moduleUMD[func]).toBeFunction();
        // expect(moduleES[func]).toBeFunction();
        // expect(moduleCJS[func]).toBeFunction();
        expect(pkg[func]).toBeFunction();
    });
});
