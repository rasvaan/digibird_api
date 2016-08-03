var path = require('path');
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
        ]
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: "js/digibird-[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin("css/digibird-[name].css")
    ]
};
