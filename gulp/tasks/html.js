var gulp         = require('gulp'),
    fs           = require('fs'),
    paths        = require('../config').paths,
    errorHandler = require('../config').swallowError,
    jade         = require ('gulp-jade');

gulp.task('html', function() {
  gulp.src(paths.src.html + "/**/[^_]*.jade")
    .pipe(jade())
    .on('error', errorHandler)
    .pipe(gulp.dest(paths.dist.html))
});