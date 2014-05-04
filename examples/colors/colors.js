'use strict';

var Console = require('../../public/MagiConsole');

Console.log('*');

var colorLogger = new Console('colors');

var methods = [
  'error',
  'warn',
  'log',
  'info',
  'debug'
];

methods.forEach(function (method) {

  colorLogger[method] && colorLogger[method](method);
});