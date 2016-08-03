var path = require('path')
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
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, loader: "json-loader" },
            { test: /\.hbs$/, loader: "handlebars-loader" }
        ]
    }
};
