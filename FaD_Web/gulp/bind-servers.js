//bind backend servers to the app
'use strict';

var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');
var concat = require('gulp-concat');
var addSrc = require('gulp-add-src');

var bindServers = function(mode){
	gulp.src('server-config.json')
  .pipe(gulpNgConfig('serverConfig',{
  	environment:mode
  }))
  .pipe(addSrc.prepend('src/app/index.module.ts'))
  .pipe(concat("index.module.ts"))
  .pipe(gulp.dest("src/app/"));
}
gulp.task('bind-servers:prod', function () {
	bindServers("production");
});
gulp.task('bind-servers:dev', function () {
	bindServers("development");
});