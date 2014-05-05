describe('MagiConsole', function () {

  'use strict';

  var Console = global.console;

  var MagiConsole = require('MagiConsole');

  var notStrings = [0, undefined, null, /foo|bar/, function () {}, {}];

  var normalLoggers = ['debug', 'error', 'info', 'log', 'warn'];

  afterEach(function () {

    MagiConsole.release();
    MagiConsole.pattern = undefined;
    MagiConsole.level = undefined;
    MagiConsole.levelOnly = false;
  });

  describe('shimmy shim shim', function () {

    var localConsole = new MagiConsole('test');

    normalLoggers.forEach(function (logger) {

      it ('should ensure console.' + logger + ' is a function', function () {

        expect(Console[logger]).to.be.a.function;
        expect(localConsole[logger]).to.be.a.function;
        expect(function () {

          localConsole[logger]('foobar');
        }).to.not.throw();
      });
    });
  });

  describe('constructor', function () {

    it ('should cache logger instances by namespace', function () {

      var logger1 = new MagiConsole('boom');
      var logger2 = new MagiConsole('boom');
      var logger3 = new MagiConsole('new-boom');

      expect(logger1).to.equal(logger2);
      expect(logger1).to.not.equal(logger3);
    });

    it ('should throw if namespace is not a string', function () {

      notStrings.forEach(function (namespace) {

        expect(function () {

          new MagiConsole(namespace);
        }).to.throw();
      });
    });

    it ('should not throw if namespace is a string', function () {

      expect(function () {

        new MagiConsole('test');
      }).to.not.throw('namespace must be a string');
    });
  });

  describe('.log', function () {

    it ('should throw if regexPatternString is not a string', function () {

      notStrings.forEach(function (notAString) {

        expect(function () {

          MagiConsole.log(notAString);
        }).to.throw('regexPatternString must be a string');
      });
    });

    it ('should set MagiConsole.pattern to a regular expression object', function () {

      var patternString = 'foo|bar';
      var expectedToString = '/foo|bar/';

      MagiConsole.log(patternString);
      expect(MagiConsole.pattern).to.be.instanceOf(RegExp);
      expect(MagiConsole.pattern.toString()).to.equal(expectedToString);
    });

    it ('should convert \'*\' to an all string matching regex pattern', function () {

      var patternString = '*';
      var expectedToString = '/.?/';

      MagiConsole.log(patternString);
      expect(MagiConsole.pattern).to.be.instanceOf(RegExp);
      expect(MagiConsole.pattern.toString()).to.equal(expectedToString);
    });
  });

  describe('.setLevel', function () {

    it ('should throw if logLevel is not a string', function () {

      notStrings.forEach(function (notAString) {

        expect(function () {

          MagiConsole.setLevel(notAString);
        }).to.throw('logLevel must be a string');
      });
    });

    it ('should set MagiConsole.level to a string', function () {

      var level = 'info';

      MagiConsole.setLevel(level);
      expect(MagiConsole.level).to.be.a.string;
      expect(MagiConsole.level).to.equal(level);
    });

    it ('\'*\' should set MagiConsole.level to undefined', function () {

      var levelString = '*';

      MagiConsole.setLevel(levelString);
      expect(MagiConsole.level).to.be.undefined;
    });
  });

  describe('Instance Tests', function () {

    describe('#shouldRunLevel', function () {

      describe('given MagiConsole.levelOnly is true', function () {

        beforeEach(function () {

          MagiConsole.setLevel('warn', true);
        });

        it ('should return false if method level is not equal to the current level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRunLevel('log')).to.be.false;
        });

        it ('should return true if method level is equal to the current level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRunLevel('warn')).to.be.true;
        });
      });

      describe('given MagiConsole.levelOnly is false', function () {

        beforeEach(function () {

          MagiConsole.setLevel('warn', false);
        });

        it ('should return false if method level is greater than the current level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRunLevel('log')).to.be.false;
        });

        it ('should return true if method level is equal to the current level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRunLevel('warn')).to.be.true;
        });

        it ('should return true if method level is less than the current level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRunLevel('error')).to.be.true;
        });
      });

      describe('given MagiConsole.level is not set', function () {

        it ('should return true', function () {

          MagiConsole.setLevel('*');
          var logger = new MagiConsole('test');

          expect(logger.shouldRunLevel('log')).to.be.true;
        });
      });

      describe('given method is not \'leveled\'', function () {

        it ('should return true', function () {

          MagiConsole.setLevel('warn', true);
          var logger = new MagiConsole('test');

          expect(logger.shouldRunLevel('dir')).to.be.true;
        });
      });
    });

    describe('#shouldRun', function () {

      describe ('given MagiConsole.level is not set', function () {

        it ('should return false if MagiConsole.pattern is undefined', function () {

          var logger = new MagiConsole('test');
          MagiConsole.pattern = undefined;
          expect(logger.shouldRun()).to.be.false;
        });

        it ('should return true if MagiConsole.pattern matches instance namespace', function () {

          var logger = new MagiConsole('test');
          MagiConsole.log('test');
          expect(logger.shouldRun()).to.be.true;
        });

        it ('should return false if MagiConsole.pattern does not match instance namespace', function () {

          var logger = new MagiConsole('test');
          MagiConsole.log('foo');
          expect(logger.shouldRun()).to.be.false;
        });
      });

      describe ('given MagiConsole.level is set', function () {

        beforeEach(function () {

          MagiConsole.log('test');
          MagiConsole.setLevel('warn');
        });

        it ('should return false if method does not match MagiConsole.level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRun('debug')).to.be.false;
        });

        it ('should return true if method matches MagiConsole.level', function () {

          var logger = new MagiConsole('test');
          expect(logger.shouldRun('warn')).to.be.true;
        });

      });
    });

    describe('#injectNamespace', function () {

      it ('should do nothing if not a \'normal\' logging method', function () {

        var logger = new MagiConsole('test');
        var firstArg = 'foo';
        var args = [firstArg];

        args = logger.injectNamespace('dir', args);
        expect(args[0]).to.equal(firstArg);
      });

      it ('should inject namespace into \'normal\' logging methods', function () {

        var logger = new MagiConsole('test');
        var firstArg = 'foo';

        var args;
        normalLoggers.forEach(function (method) {

          args = [firstArg];
          args = logger.injectNamespace(method, args);
          expect(args[0]).to.equal('[TEST] foo');
        });
      });

      it ('should inject even if first arg is not a string', function () {

        var logger = new MagiConsole('test');
        var firstArg = {'foo': 'bar'};

        var args;
        normalLoggers.forEach(function (method) {

          args = [firstArg];
          args = logger.injectNamespace(method, args);
          expect(args[0]).to.equal('[TEST]');
          expect(args[1]).to.equal(firstArg);
        });
      });
    });

    describe('#log', function () {

      describe ('given MagiConsole.level is not set', function () {

        it ('should run if MagiConsole is setup for the instance namespace', function () {

          var logSpy = sinon.spy(console, 'log');
          var logger = new MagiConsole('test');
          MagiConsole.log('test');

          logger.log('foobar');

          expect(logSpy).to.have.been.calledOnce;
          logSpy.restore();
        });

        it ('should not run if MagiConsole is not setup for the instance namespace', function () {

          var logSpy = sinon.spy(console, 'log');
          var logger = new MagiConsole('test');
          MagiConsole.log('foo');

          logger.log('foobar');

          expect(logSpy).to.not.have.been.called;
          logSpy.restore();
        });
      });

      describe ('given MagiConsole.level is set', function () {

        beforeEach(function () {

          MagiConsole.log('test');
          MagiConsole.setLevel('warn');
        });

        it ('should run if method matches current level', function () {

          var warnSpy = sinon.spy(console, 'warn');
          var logger = new MagiConsole('test');

          logger.warn('foobar');

          expect(warnSpy).to.have.been.calledOnce;
          warnSpy.restore();
        });

        it ('should not run if method does not match current level', function () {

          var logSpy = sinon.spy(console, 'log');
          var logger = new MagiConsole('test');

          logger.log('foobar');

          expect(logSpy).to.not.have.been.called;
          logSpy.restore();
        });
      });
    });
  });
});