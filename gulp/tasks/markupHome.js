var gulp = require('gulp');
var config = require('../config').markupHome;

gulp.task('markupHome', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
