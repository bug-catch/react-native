// webpack.config.js
module.exports = {
    mode: "production", // "development"
    entry: "./src/bugcatch.js",
    output: {
        filename: "bugcatch.js",
        library: {
            type: "umd",
            name: "bugcatch",
        },
        // prevent error: `Uncaught ReferenceError: self is not define`
        globalObject: "this",
    },
};
