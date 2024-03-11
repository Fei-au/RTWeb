const EslintWebpackPlugin = require('eslint-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerCssPlugin = require('css-minimizer-webpack-plugin');
const TerserCssPlugin = require('terser-webpack-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const webpack = require('webpack');
const dotenv = require('dotenv');
const env = process.env.NODE_ENV; // 'development' 或 'production'
const envFilePath = env === 'production' ? '.env.production' : '.env.development';
const envVars = dotenv.config({ path: envFilePath }).parsed;
const envKeys = Object.keys(envVars).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(envVars[next]);
    return prev;
}, {});

const isDevelopment = process.env.NODE_ENV !== 'production';
// return deal with style func
const getStyleLoaders = (pre)=>{
    return [
        MiniCssExtractPlugin.loader,
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
        path: path.resolve(__dirname, '../build'),
        filename: 'static/js/[name].[contenthash].js',
        chunkFilename: 'static/js/[name].[contenthash].chunk.js',
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true,
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
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean), // enable js HMR
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
        isDevelopment && new ReactRefreshWebpackPlugin(), // enable js HMR
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                },
            ],
        }),
        new webpack.DefinePlugin(envKeys),
    ].filter(Boolean),
    mode: 'production',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: entrypoint => `runtime~${entrypoint.name}.js`,
        },
        minimizer: [
            new CssMinimizerCssPlugin(),
            new TerserCssPlugin(),
            new ImageMinimizerWebpackPlugin({
                minimizer:{
                    implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ['gifsicle', {interlaced: true}],
                            ['jpegtran', {progressive: true}],
                            ['optipng', {optimizationLevel: 5}],
                            ['svgo', {
                                plugins: [
                                    'preset-default',
                                    'prefixIds',
                                    {
                                        name: 'sortAttrs',
                                        params: {
                                            xmlnsOrder: 'alphabetical',
                                        }
                                    }
                                ]
                            }],
                        ]
                    }
                }
            }),
        ],
    },
    resolve:{
        // automatic fill up file name to .jsx, .js, .json
        extensions: ['.jsx', '.js', '.json'],
    },
}