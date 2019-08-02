import * as AddAssetHtmlPlugin from "add-asset-html-webpack-plugin";
import * as HtmlWebPackPlugin from "html-webpack-plugin";
import * as path from 'path';
import * as webpack from 'webpack';

function PathResolve(fileName: string)
{
    return path.resolve(__dirname, fileName);
}

const config: webpack.Configuration = {
    entry: "./src/index.ts",
    output: {
        filename: "[hash].main.js",
        path: path.resolve(__dirname, "../dist/")
    },
    resolve: {
        alias: {},
        extensions: [".ts", ".tsx", ".js", "json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'cache-loader', options: { cacheDirectory: "node_modules/.cache_loader" } },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        },
                    }
                ],
            },
            {
                test: /\.[(png)|(obj)|(json)]$/,
                loader: "file-loader"
            },
            //样式加载 css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            //样式加载 less
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                },
                { loader: 'css-loader', options: { sourceMap: false } },
                {
                    loader: "less-loader",
                    options: {
                        strictMath: true,
                        noIeCompat: true
                    }
                }
                ]
            },
            //字体加载 blueprint
            {
                test: /\.(ttf|eot|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[hash].[ext]'
                    }
                }
            },
            //字体加载 blueprint
            {
                test: /\.(woff|woff2|jpg|png)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[hash].[ext]',
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                }
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'shader-loader'
            }
        ]
    },
    externals: {
    },
    plugins: [
        new HtmlWebPackPlugin({
            title: "WebCAD",
            template: PathResolve('../src/index.html')
        }),
        new AddAssetHtmlPlugin([]),
    ],
    node: false
};

export default config;
