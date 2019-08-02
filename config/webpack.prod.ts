import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';
import * as AddAssetHtmlPlugin from "add-asset-html-webpack-plugin";
import TerserPlugin = require('terser-webpack-plugin');

const config: webpack.Configuration = merge(
    common,
    {
        mode: "production",
        devtool: "source-map",

        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    terserOptions: {
                        ecma: 7,
                        sourceMap: true,
                        keep_classnames: true,
                    }
                }),
            ]
        },

        plugins: [
        ]
    }
);

export default config;
