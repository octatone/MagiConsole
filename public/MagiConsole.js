'use strict';

var Console = global.console;
var WBClass = require('../node_modules/wunderbits.core/public/WBClass');
var assert =  require('../node_modules/wunderbits.core/public/lib/assert');
var functions =  require('../node_modules/wunderbits.core/public/lib/functions');
var toArray = require('../node_modules/wunderbits.core/public/lib/toArray');

var _logLevels = {
  'error': 3,
  'warn': 4,
  'log': 5,
  'info': 6,
  'debug': 7
};
var _normalLoggers = Object.keys(_logLevels);

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

  'injectNamespace': function (method, args) {

    if (_normalLoggers.indexOf(method) >= 0) {
      args = toArray(args);
      var namespaceString = '[' + this.namespace.toUpperCase() + ']';
      if (typeof args[0] === 'string') {
        args[0] = namespaceString + ' ' + args[0];
      }
      else {
        args.unshift(namespaceString);
      }
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

MagiConsole.namespaces = {};
MagiConsole.pattern = undefined;
MagiConsole.level = undefined;
MagiConsole.levelOnly = false;

MagiConsole.release = function () {

  MagiConsole.namespaces = {};
};

MagiConsole.log = function (regexPatternString) {

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

if (!process.browser) {
  var env = process.env;
  var envPattern = env.MLOG;
  var envLevel = env.MLEVEL;
  envPattern && MagiConsole.log(envPattern);
  envLevel && MagiConsole.setLevel(envLevel, env.MLEVELONLY === 'true');
}

module.exports = global.MagiConsole = MagiConsole;