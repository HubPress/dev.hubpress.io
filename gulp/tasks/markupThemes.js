var gulp = require('gulp');
var config = require('../config').markupThemes;

gulp.task('markupThemes', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
