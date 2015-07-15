var gulp = require('gulp');
var config = require('../config').helpers;

gulp.task('helpers', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
