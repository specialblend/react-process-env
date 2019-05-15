/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

module.exports = {
    entry: './src/main.js',
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
        path: path.join(__dirname, 'build'),
        filename: 'index.js',
    },
};
