const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const jsUglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

//Paths
const paths = {
    scss: {
        src: "scss/*.scss",
        dest: "./",
        watch: "./scss/**/*.scss",
        destFile: "style.css"
    },
    js: {
        src: "./js/*.js",
        dest: "./js/minified",
        watch: "./js/*.js",
        destFileIndicator: ".min"
    },
    images: {
        src: "./assets/images/*",
        dest: "./assets/images"
    }
};

//Scss To Minified CSS
const scssToMinifiedCss = () =>
    gulp.src(paths.scss.src)
        .pipe(sass().on('error', sass.logError)).pipe(sass({ includePaths: ['./scss'] }))
        .pipe(cleanCss())
        .pipe(rename(paths.scss.destFile))
        .pipe(gulp.dest(paths.scss.dest));
;

//Minify JS
const minifyJs = () =>
    gulp.src(paths.js.src)
        .pipe(jsUglify())
        .pipe(rename(function (file) {
            file.basename += paths.js.destFileIndicator
        }))
        .pipe(gulp.dest(paths.js.dest));
;

//Image Compress
const compressImages = () =>
    gulp.src(paths.images.src)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),], { verbose: true }
        ))
        .pipe(gulp.dest(paths.images.dest));

//Watch Methods
const watchModified = () => {
    gulp.watch(paths.scss.watch, gulp.series(scssToMinifiedCss));
    gulp.watch(paths.js.watch, gulp.series(minifyJs));
}

const watchAdded = () => {
    gulp.watch('./assets/images', { events: ['add'] }, gulp.series(compressImages));
}

const watch = () => {
    watchModified();
    watchAdded();
}


exports.default = () => watch();