const pkg = require('./dist/index');
const packageJSON = require('./package.json');

const functions = ['injectPayload', 'injectScript', 'renderScript', 'resolveEnv'];

describe('exports are importable', () => {
    test.each(functions)('%p', func => {
        expect(pkg[func]).toBeFunction();
    });
});

describe('package.json has correct exports', () => {
    expect(packageJSON).toMatchObject({
        main: 'src/index.js',
        module: 'dist/index.js',
        browser: 'dist/index.js',
    });
});
