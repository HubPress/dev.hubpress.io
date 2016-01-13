var gulp = require('gulp');
var replace = require('gulp-replace');
var p = require('../../package.json');
var config = require('../config').version;

gulp.task('version', function() {
  return gulp.src(config.src)
    .pipe(replace(/\{version\}/g, p.version + '-' + Date.now()))
    .pipe(gulp.dest(config.dest));
});
