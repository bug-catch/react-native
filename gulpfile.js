const gulp = require("gulp");
const umd = require("gulp-umd");
const prettier = require("gulp-prettier");

/*
 * Apply prettier to all js files
 */
gulp.task("default", () => {
    return gulp
        .src([
            "./src/**/*.js",
            "./package.json",
            "./.eslintrc.js",
            "./gulpfile.js",
        ])
        .pipe(prettier({ editorconfig: true }))
        .pipe(gulp.dest((file) => file.base));
});

/*
 * UMD build
 */
gulp.task("build", function () {
    return gulp.src("src/*.js").pipe(umd()).pipe(gulp.dest("build"));
});
