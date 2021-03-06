'use strict';

var isBrowser = process.browser;
if (isBrowser && global.MagiConsole) {
  module.exports = global.MagiConsole;
}
else {
  var Console = global.console;
  var WBClass = require('wunderbits.core/public/WBClass');
  var assert =  require('wunderbits.core/public/lib/assert');
  var functions =  require('wunderbits.core/public/lib/functions');
  var toArray = require('wunderbits.core/public/lib/toArray');

  var _logLevels = {
    'error': 3,
    'warn': 4,
    'log': 5,
    'info': 6,
    'debug': 7
  };
  var _normalLoggers = Object.keys(_logLevels);

  var _colors = {
    'blue': '\x1B[34m',
    'cyan': '\x1B[36m',
    'green': '\x1B[32m',
    'grey': '\x1B[90m',
    'magenta': '\x1B[35m',
    'red': '\x1B[31m',
    'white': '\x1B[37m',
    'yellow': '\x1B[33m'
  };
  var _colorTerminator = '\x1B[39m';

  var _colorMap = {
    'debug': 'cyan',
    'error': 'red',
    'info': 'grey',
    'log': 'white',
    'warn': 'yellow'
  };

  // let there be debug!
  _normalLoggers.forEach(function (logger) {
    if (typeof Console[logger] !== 'function') {
      Console[logger] = Console.log;
    }
  });

  var MagiConsolePrototype = {

    'constructor': function (namespace) {

      var self = this;

      assert.string(namespace, 'namespace must be a string');

      // if a cached namespaced logger already exists, simply return it
      var namespaceMap = MagiConsole.namespaces;
      if (namespaceMap[namespace] instanceof MagiConsole) {
        return namespaceMap[namespace];
      }

      self.namespace = namespace;
      namespaceMap[namespace] = self;

      WBClass.call(self);
    },

    'shouldRunLevel': function (method) {

      var currentLevel = _logLevels[MagiConsole.level];
      var methodLevel = _logLevels[method];

      if (currentLevel === undefined || methodLevel === undefined) {
        return true;
      }
      else {
        return MagiConsole.levelOnly ? methodLevel === currentLevel : methodLevel <= currentLevel;
      }
    },

    'shouldRun': function (method) {

      var self = this;
      var pattern = MagiConsole.pattern;
      var level = MagiConsole.level;

      var shouldRun = pattern && pattern.test(self.namespace);
      shouldRun = shouldRun && (level ? self.shouldRunLevel(method) : true);
      return !!(shouldRun && Console);
    },

    'colorizeString': function (string, color) {

      return _colors[color] + string + _colorTerminator;
    },

    'colorizeNamespace': function (string, method) {

      var color = _colorMap[method];
      if (color) {
        string = this.colorizeString(string, color);
      }

      return string;
    },

    'colorizeStrings': function (method, args) {

      var self = this;

      args.forEach(function (arg, index) {

        if (typeof arg === 'string') {
          args[index] = self.colorizeNamespace(arg, method);
        }
      });

      return args;
    },

    'injectNamespace': function (method, args) {

      var self = this;

      if (_normalLoggers.indexOf(method) >= 0) {
        args = toArray(args);
        var namespaceString = '[' + self.namespace.toUpperCase() + ']';
        if (typeof args[0] === 'string') {
          args[0] = namespaceString + ' ' + args[0];
        }
        else {
          args.unshift(namespaceString);
        }

        !isBrowser && self.colorizeStrings(method, args);
      }

      return args;
    }
  };

  functions(Console).forEach(function (method) {

    MagiConsolePrototype[method] = function methodWrapper () {

      var self = this;
      var args = arguments;
      if (self.shouldRun(method)) {
        args = self.injectNamespace(method, args);
        Console[method].apply(Console, args);
      }
    };
  });

  var MagiConsole = WBClass.extend(MagiConsolePrototype);

  MagiConsole.release = function () {

    MagiConsole.namespaces = {};
  };

  MagiConsole.reset = MagiConsole.off = function () {

    MagiConsole.pattern = undefined;
    MagiConsole.level = undefined;
    MagiConsole.levelOnly = false;
  };

  MagiConsole.setPattern = function (regexPatternString) {

    assert.string(regexPatternString, 'regexPatternString must be a string');
    regexPatternString = regexPatternString === '*' ? '.?' : regexPatternString;
    MagiConsole.pattern = new RegExp(regexPatternString);
  };

  MagiConsole.setLevel = function (logLevel, levelOnly) {

    assert.string(logLevel, 'logLevel must be a string');
    logLevel = logLevel === '*' ? undefined : logLevel;
    MagiConsole.level = logLevel;
    MagiConsole.levelOnly = !!levelOnly;
  };

  if (!isBrowser) {
    var env = process.env;
    var envPattern = env.MLOG;
    var envLevel = env.MLEVEL;
    envPattern && MagiConsole.setPattern(envPattern);
    envLevel && MagiConsole.setLevel(envLevel, env.MLEVELONLY === 'true');
  }

  MagiConsole.release();
  MagiConsole.reset();

  module.exports = MagiConsole;
}
