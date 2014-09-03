var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var liveReload = require('gulp-livereload');
var browserSync = require('browser-sync');

var source = require('vinyl-source-stream');
var browserify = require('browserify');

var gbro = require('gulp-browserify');
var reactify = require('reactify');
var envify = require('envify');
var rename = require('gulp-rename');

function errHandler(err){
    gutil.beep();
    console.log('err reported by: ', err.plugin);
    console.log('\tfile:  ', err.fileName);
    console.log('\tline:  ', err.lineNumber);
    console.log('\tstack: ', err.stack);
}


var bundleTask;
bundleTask = 'bundle-gulp-browserify';


gulp.task('bundle-browserify', function(){
    return browserify({
       //do your config here
        entries: './js/app.js',
    })
    .bundle()
    .pipe(source('bundle.js')) //this converts to stream, string param is the new name of the file stream
     //do all processing here.
     //like uglification and so on.
    .pipe(gulp.dest('./js'));
});


gulp.task('bundle-gulp-browserify', function(){
    return gulp.src('./js/app.js')
        .pipe(plumber({errorHandler: errHandler}))
        .pipe(gbro({
            transform: [reactify, envify]
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./js'));
});

gulp.task('watch', function(){
    // gulp-livereload module updated... 
    liveReload.listen();

    var file2w = ['./js/**/*.js', '!./js/bundle.js'];
    gulp.watch(file2w, [bundleTask]);
    // gulp.watch(file2w, function(file){
    //     console.log(file.path);
    // });
    
    var file2r = ['./index.html', 'js/bundle.js'];
    gulp.watch(file2r, liveReload.changed);

    // browser-sync module always open new tab, i don't like it
    // gulp.watch(file2w, [browserSync.reload]);
});


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', [ bundleTask ]);

gulp.task('wd', [bundleTask, 'watch']);