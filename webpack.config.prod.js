const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/app.ts",
    mode: 'production',
    devtool: 'none',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin()
    ]
}