var gulp              = require('gulp'),
    paths             = require('../config').paths,
    errorHandler      = require('../config').swallowError,
    browserify        = require('browserify'),
    babel             = require('babel-core'),
    babelify          = require('babelify'),
    buffer            = require('vinyl-buffer'),
    filter            = require('gulp-filter'),
    source            = require('vinyl-source-stream'),
    sourcemaps        = require('gulp-sourcemaps');

gulp.task('js', function() {
  browserify(paths.src.js + '/application.js', {debug: true})
    .transform(babelify)
    .bundle().on('error', errorHandler)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.dist.js).on('error', errorHandler))
    .on('error', errorHandler);
});