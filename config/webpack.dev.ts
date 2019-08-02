import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';

const config: webpack.Configuration = merge(
    common,
    {
        mode: "development",
        output: { pathinfo: false },
        devtool: "cheap-module-eval-source-map",
        devServer: {
            port: 7779,
            host: "0.0.0.0",
            hot: true
        },
        // module: {
        //     rules: [
        //         {
        //             test: /\.js$/,
        //             use: ["source-map-loader"],
        //             enforce: "pre"
        //         }
        //     ]
        // },
        plugins: [
            new webpack.NamedModulesPlugin(),//Hot
            new webpack.HotModuleReplacementPlugin(),//Hot
        ]
    }
);

export default config;
