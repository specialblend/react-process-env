const pkg = require('./dist/index');

const functions = ['injectPayload', 'injectScript', 'renderScript', 'resolveEnv'];

describe('exports are importable', () => {
    test.each(functions)('%p', func => {
        expect(pkg[func]).toBeFunction();
    });
});
