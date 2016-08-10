module.exports = {
    fontAwesomeCustomizations: "./font-awesome.config.scss",
    styleLoader: require("extract-text-webpack-plugin").extract("style-loader", "css-loader!sass-loader"),
    styles: {
        "mixins": false,
        "core": true,
        "icons": true,
        "larger": false,
        "path": true
    }
};
