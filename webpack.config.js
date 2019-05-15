const path = require('path');
const packageJSON = require('./package.json');

const output = path.resolve(packageJSON.browser);

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: __dirname,
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.dirname(output),
        filename: path.basename(output),
    },
};
