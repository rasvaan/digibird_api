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
        path: path.resolve(__dirname, 'assets', 'js'),
        filename: "digibird-[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
        ]
    },
    plugins: [
        // css files from the extract-text-plugin loader
        new ExtractTextPlugin("../css/digibird-[name].css")
    ]
};
