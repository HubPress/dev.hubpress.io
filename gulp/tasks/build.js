var gulp = require('gulp');

gulp.task('build', ['browserify', 'helpers', 'vendors', 'markup', 'markupHome','markupThemes','markupImages', 'version', 'fontIcons', 'css']);
