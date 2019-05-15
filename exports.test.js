const packageUMD = require('./dist/index.umd');
const packageCJS = require('./dist/index.cjs');
const packageESM = require('./dist/index.esm');
const packageJSON = require('./package.json');

const packages = [['UMD', packageUMD], ['CJS', packageCJS], ['ESM', packageESM]];
const functions = ['injectPayload', 'injectScript', 'renderScript', 'resolveEnv'];

describe('package.json has correct outputs', () => {
    expect(packageJSON).toMatchObject({
        main: 'dist/index.cjs.js',
        module: 'dist/index.esm.js',
        browser: 'dist/index.umd.js',
    });
});

describe('exports correctly', () => {
    describe.each(packages)('package type=%p', (label, __package__) => {
        test.each(functions)('function name=%p', funcName => {
            expect(__package__).toHaveProperty(funcName, expect.any(Function));
        });
    });
});
