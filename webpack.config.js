module.exports = {
    entry: './src/index.js',
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ["style", "css", "sass"],
                exclude: /node_modules/
            }
        ]
    },
    output: {
        path: './bin',
        filename: 'index.bundle.js'
    },
};
