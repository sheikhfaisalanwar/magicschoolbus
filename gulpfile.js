var gulp = require('gulp'),
  gulpConcat = require('gulp-concat'),
  gulpClean = require('gulp-clean'),
  gulpMinify = require('gulp-minify'),
  gulpInject = require('gulp-inject'),
  gulpCopy = require('gulp-copy');

var copyHTML = require('ionic-gulp-html-copy');

var options = {
  dist: './dist/',
  src: './client/',
  app: {
    js: [],
    css: [],
    html: [],
  },
  vendor: {
    js: [],
    css: [],
  }
};

options.app.js = [
  '**.js',
  'components/**/**.js',
  'shared/**/**/**.js'
  ].map(function(subPath) { return options.src + 'app/' + subPath;});

options.app.css = [
  '**.css',
  'components/**/**.css',
  'shared/**/**/**.css'
  ].map(function(subPath) { return options.src + 'app/' + subPath;});

options.app.html = [
  '**/**/**.html'
  ].map(function(subPath) { return options.src + 'app/' + subPath;});

options.vendor.js = [
  'ionic/js/ionic.bundle.js',
  'noCordova/dist/ng-cordova-min.js',
  'angular-local-storage/dist/angular-local-storage.js',
  'angular-ui-router/release/angular-ui-router.min.js',
  'lodash/dist/lodash.min.js',
  'ng-material-floating-button/src/mfb-directive.js',
  'ngmap/build/scripts/ng-map.min.js',
  'ngAutocomplete/src/ngAutocomplete.js',
  ].map(function(subPath) { return options.src + 'bower_components/' + subPath;});


options.vendor.css = [
  'ionic/css/ionic.min.css',
  'ng-material-floating-button/src/mfb/dist/mfb.css',
  ].map(function(subPath) { return options.src + 'bower_components/' + subPath;});

options.fonts = [
  'ionic/fonts/**',
].map(function(subPath) { return options.src + 'bower_components/' + subPath;});


gulp.task('clean', function () {
    return gulp.src(options.dist, {read: false})
        .pipe(gulpClean());
});

gulp.task('concat.app.js', ['clean'], function() {
    return gulp.src(options.app.js)
        .pipe(gulpConcat('app.js'))
        // .pipe(gulpMinify())
        .pipe(gulp.dest(options.dist + 'js/'));
});

gulp.task('concat.vendor.js', ['clean'], function() {
    return gulp.src(options.vendor.js)
        .pipe(gulpConcat('vendor.js'))
        // .pipe(gulpMinify())
        .pipe(gulp.dest(options.dist + 'js/'));
});


gulp.task('concat.app.css', ['clean'], function() {
    return gulp.src(options.app.css)
        .pipe(gulpConcat('app.css'))
        .pipe(gulp.dest(options.dist + 'css/'));
});

gulp.task('concat.vendor.css', ['clean'], function() {
    return gulp.src(options.vendor.css)
        .pipe(gulpConcat('vendor.css'))
        .pipe(gulp.dest(options.dist + 'css/'));
});

gulp.task('inject.html.js', ['clean', 'concat.vendor.js', 'concat.app.js', 'concat.vendor.css', 'concat.app.css'], function() {
  return gulp.src(options.src + 'index.html')
    .pipe(gulpInject(gulp.src(options.dist + 'js/vendor.js'), {addRootSlash: false, ignorePath: 'dist', name: 'inject:vendor'}))
    .pipe(gulpInject(gulp.src(options.dist + 'js/app.js'), {addRootSlash: false, ignorePath: 'dist', name: 'inject:app'}))
    .pipe(gulpInject(gulp.src(options.dist + 'css/vendor.css'), {addRootSlash: false, ignorePath: 'dist', name: 'inject:vendor'}))
    .pipe(gulpInject(gulp.src(options.dist + 'css/app.css'), {addRootSlash: false, ignorePath: 'dist', name: 'inject:app'}))
    .pipe(gulp.dest(options.dist));
});

gulp.task('copy.fonts', ['clean'], function() {
    return gulp.src(options.fonts)
      .pipe(gulpCopy(options.dist + 'fonts', {prefix: 4}));
});



gulp.task('copy.html', ['clean'], function(){
  return copyHTML({ src: options.app.html, dest: 'dist/app/'});
});
gulp.task('default', ['clean', 'concat.app.js', 'concat.vendor.js', 'concat.app.css', 'concat.app.css', 'inject.html.js', 'copy.html', 'copy.fonts']);
