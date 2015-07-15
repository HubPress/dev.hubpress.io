var gulp = require('gulp');
var config = require('../config').markupImages;

gulp.task('markupImages', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
