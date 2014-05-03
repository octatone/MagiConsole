'use strict';

var Console = global.console;
var core = require('wunderbits.core');

var WBClass = core.WBClass;
var assert = core.lib.assert;
var functions = core.lib.functions;

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

  'shouldRun': function () {

    var shouldRun = MagiConsole.pattern && MagiConsole.pattern.test(this.namespace);
    return !!(shouldRun && Console);
  }
};

functions(Console).forEach(function (method) {

  MagiConsolePrototype[method] = function () {

    this.shouldRun() && Console[method].apply(Console, arguments);
  };
});

var MagiConsole = WBClass.extend(MagiConsolePrototype);

MagiConsole.namespaces = {};

MagiConsole.release = function () {

  MagiConsole.namespaces = {};
};

MagiConsole.log = function (regexPatternString) {

  assert.string(regexPatternString, 'regexPatternString must be a string');
  regexPatternString = regexPatternString === '*' ? '.?' : regexPatternString;
  MagiConsole.pattern = new RegExp(regexPatternString);
};

module.exports = global.MagiConsole = MagiConsole;