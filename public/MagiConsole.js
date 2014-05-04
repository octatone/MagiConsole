'use strict';

var Console = global.console;

var WBClass = require('../node_modules/wunderbits.core/public/WBClass');
var assert =  require('../node_modules/wunderbits.core/public/lib/assert');
var functions =  require('../node_modules/wunderbits.core/public/lib/functions');

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

    // forces GC of potentially large object immediately
    namespaceMap = null;
  },

  'shouldRun': function (method) {

    var pattern = MagiConsole.pattern;
    var level = MagiConsole.level;

    var shouldRun = pattern && pattern.test(this.namespace);
    shouldRun = shouldRun && (level ? method === level : true);
    return !!(shouldRun && Console);
  }
};

functions(Console).forEach(function (method) {

  MagiConsolePrototype[method] = function () {

    this.shouldRun(method) && Console[method].apply(Console, arguments);
  };
});

var MagiConsole = WBClass.extend(MagiConsolePrototype);

MagiConsole.namespaces = {};
MagiConsole.pattern = undefined;
MagiConsole.level = undefined;

MagiConsole.release = function () {

  MagiConsole.namespaces = {};
};

MagiConsole.log = function (regexPatternString) {

  assert.string(regexPatternString, 'regexPatternString must be a string');
  regexPatternString = regexPatternString === '*' ? '.?' : regexPatternString;
  MagiConsole.pattern = new RegExp(regexPatternString);
};

MagiConsole.setLevel = function (logLevel) {

  assert.string(logLevel, 'logLevel must be a string');
  logLevel = logLevel === '*' ? undefined : logLevel;
  MagiConsole.level = logLevel;
};

if (!process.browser) {
  var envPattern = process.env.MLOG;
  var envLevel = process.env.MLEVEL;
  envPattern && MagiConsole.log(envPattern);
  envLevel && MagiConsole.setLevel(envLevel);
}

module.exports = global.MagiConsole = MagiConsole;