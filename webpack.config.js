const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/bugcatch.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bugcatch.js",
        library: "bugcatch",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    mode: "production", // "development"
};