const EslintWebpackPlugin = require('eslint-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const env = process.env.REACT_ENV; // 'development' 或 'production'
const envFilePath = `./.env.${env}`;
const envVars = dotenv.config({ path: envFilePath }).parsed;
const envKeys = Object.keys(envVars).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
    return prev;
}, {});

const isDevelopment = process.env.REACT_ENV !== 'production';
host = envVars['TEST_HOST']
console.log('host', host)

// return deal with style func
const getStyleLoaders = (pre)=>{
    return [
        'style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'],
                }
            }
        },
        pre,
    ].filter(Boolean);
}


module.exports = {
    entry: './src/index.js',
    output: {
        path: undefined,
        filename: 'static/js/[name].[contenthash].js',
        chunkFilename: 'static/js/[name].[contenthash].chunk.js',
        assetModuleFilename: "static/media/[hash:10][ext][query]",
    },
    module:{
        rules:[
            // css
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            // less
            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader'),

            },
            // sass
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader'),

            },
            // stylus-loader
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader'),
            },
            // imgs
            {
                test: /\.(jpe?g|png|gif|webp|svg)/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
            },
            {
                test: /\.(woff2?|ttf)/,
                type: 'asset/resource',
            },
            // js, use babel loader to transfer jsx to js
            {
                test: /\.[jt]sx?$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: false,
                    // cacheCompression: false,
                    // plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean), // enable js HMR
                }
            },
        ],
    },

    plugins: [
        // use eslint to check syntax problem or error. 
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src/'),
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        // html
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new webpack.DefinePlugin(envKeys),
        isDevelopment && new ReactRefreshWebpackPlugin(), // enable js HMR
    ].filter(Boolean),
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`,
        }
    },
    resolve:{
        // automatic fill up file name to .jsx, .js, .json
        extensions: ['.jsx', '.js', '.json'],
    },
    devServer: {
        host: host,
        port: 3001,
        open: true,
        hot: true, // enable HMR
        historyApiFallback: true, // solve frontend router 404 not found
    }

}