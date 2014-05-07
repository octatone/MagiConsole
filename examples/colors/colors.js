'use strict';

var Console = require('../../public/MagiConsole');

Console.setPattern('*');

var colorLogger = new Console('colors');

var methods = [
  'error',
  'warn',
  'log',
  'info',
  'debug'
];

methods.forEach(function (method) {

  colorLogger[method] && colorLogger[method](method, {'foo': 'bar'}, true, false, undefined, 1, 'foobar');
});

colorLogger.dir({
  'test': 'foobar'
});