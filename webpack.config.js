var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'app': './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, './distrib'),
        publicPath: '/distrib',
        filename: "[name].js"
    },
    devServer: {
        historyApiFallback: true,
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: path.resolve(__dirname, 'tsconfig.json')
                        }
                    },
                    'angular2-template-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src/app'),
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core/,
            path.resolve(__dirname, 'src'),
            {}
        ),
        new UglifyJSPlugin()
    ]
}