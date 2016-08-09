var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        "home": [
            "./client/js/home.js"
        ],
        "people": [
            "./client/js/people.js"
        ],
        "blog": [
            "./client/js/blog.js"
        ],
        "vendor": [
            "jquery",
            "bootstrap-loader",
            "font-awesome-sass-loader!./src/theme/font-awesome-sass.config.js"
        ]
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: "js/digibird-[name].js"
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader", "sass-loader") },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name].[ext]" }
        ]
    },
    plugins: [
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin("css/digibird-[name].css"),
        // split vendor files from app files
        new webpack.optimize.CommonsChunkPlugin("vendor", "js/digibird-vendor.js"),
        // add jquery to the global window
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};
