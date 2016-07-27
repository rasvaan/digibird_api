module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty'
    }
};
