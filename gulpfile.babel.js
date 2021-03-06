const gulp = require('gulp');
const babel = require('gulp-babel');
const csso = require('gulp-csso');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const mocha = require('gulp-mocha-co');
const eslint = require('gulp-eslint');
const nodemon = require('nodemon');
const webpack = require('webpack-stream');
const istanbul = require('gulp-istanbul');

const webpackConfig = require('./webpack.client.config.js');
const webpackServerConfig = require('./webpack.server.config.js');

const rootDir = './dist';

require('babel-register');
require('babel-polyfill');

/** lint task **/
gulp.task('lint', () =>
  gulp.src(['./app/**/*.js', '!node_modules/**', '!./app/resources/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError()),
);

gulp.task('pre-test', () => {
  return gulp.src(['tests/*.test.js'])
        .pipe(babel({
          presets: ['es2015'],
        }))
	.pipe(istanbul())
	.pipe(istanbul.hookRequire());
});

/** run test **/
gulp.task('test', ['pre-test'], () => {
  process.env.TEST_DB_URI = 'mongodb://localhost:27017/fake-data';
  gulp.src('tests/*.test.js')
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(mocha({
      reporter: 'spec',
    }))
    .pipe(istanbul.writeReports({
      dir: '.',
      reporters: ['lcovonly'],
      reportOpts: {
        lcov: {dir: 'lcovonly', file: 'lcov.info'}
        }
    }));
});

/** steps db conversion **/
const activeStepsConverterFunction = require('./server/database/mongodbScripts/activeStepsConverterScript');
const fullStepsConverterFunction = require('./server/database/mongodbScripts/fullStepsConverterScript');

gulp.task('set-convert-dbs', () => {
  process.env.SRC_DB_URI = 'mongodb://localhost:27017/steps-api-sanitised';
  process.env.DEST_DB_URI = 'mongodb://localhost:27017/dev';
});

gulp.task('active-convert', ['set-convert-dbs'], activeStepsConverterFunction);
gulp.task('full-convert', ['set-convert-dbs'], fullStepsConverterFunction);

/** minimizing files and bundling **/
gulp.task('css', () =>
  gulp.src('./app/resources/style/**/*.scss')
    .pipe(
      sass({
        includePaths: ['./app/resources/style'],
        errLogToConsole: true,
      }))
    .pipe(csso())
    .pipe(gulp.dest(`${rootDir}/resources/style/`)),
);

gulp.task('html', () =>
  gulp.src('./app/*.html')
    .pipe(gulp.dest(rootDir)),
);

gulp.task('image', () =>
  gulp.src('./app/resources/images/*.+(png|jpg|svg|ico)')
    .pipe(imagemin())
    .pipe(gulp.dest(`${rootDir}/resources/images/`)),
);

gulp.task('bundle', () =>
  gulp.src('./app/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(rootDir)),
);

gulp.task('fonts', () =>
  gulp.src('./app/resources/fonts/*.+(otf|ttf|eof|ttc|woff)')
    .pipe(gulp.dest(`${rootDir}/resources/fonts/`)),
);

/** watch file changes **/
gulp.task('watch', () => {
  gulp.watch('./app/resources/style/**/*.scss', ['css']);
  gulp.watch('./app/*.html', ['html']);
  gulp.watch('./app/**/*.js', ['bundle']);
});

gulp.task('buildServer', () => {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/dev';
  process.env.JWT_SECRET = 'temp';
  gulp.src('./server/server.js')
      .pipe(webpack(webpackServerConfig))
      .pipe(gulp.dest('./server/'));
});

gulp.task('buildClient', ['css', 'html', 'image', 'bundle']);

/** run gulp task for development **/
gulp.task('default', ['watch', 'css', 'html', 'image', 'bundle', 'fonts', 'buildServer'], () => {
  nodemon({
    script: './server/server.bundle.js',
    ignore: ['./dist/'],
  });
});
