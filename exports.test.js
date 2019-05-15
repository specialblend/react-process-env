const indexPackage = require('./index');
const distPackage = require('./dist/index');
const packageJSON = require('./package.json');

const functions = ['injectPayload', 'injectScript', 'renderScript', 'resolveEnv'];

describe('exports correctly', () => {
    test.each(functions)('%p', func => {
        expect(indexPackage[func]).toBeFunction();
    });
    test.each(functions)('%p', func => {
        expect(distPackage[func]).toBeFunction();
    });
});

describe('package.json has correct exports', () => {
    expect(packageJSON).toMatchObject({
        main: 'src/index.js',
        module: 'dist/index.js',
        browser: 'dist/index.js',
    });
});
