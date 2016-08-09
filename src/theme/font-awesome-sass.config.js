module.exports = {
    fontAwesomeCustomizations: "./_font-awesome.config.scss",
    styleLoader: require("extract-text-webpack-plugin").extract("style-loader", "css-loader!sass-loader"),
    styles: {
        "mixins": false,
        "bordered-pulled": false,
        "core": true,
        "fixed-width": false,
        "icons": true,
        "larger": false,
        "list": false,
        "path": true,
        "rotated-flipped": false,
        "animated": false,
        "stacked": false
    }
};
