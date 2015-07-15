var gulp = require('gulp');
var config = require('../config').vendors;

gulp.task('vendors', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
