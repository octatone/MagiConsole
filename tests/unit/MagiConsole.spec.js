describe('MagiConsole', function () {

  'use strict';

  var MagiConsole = require('MagiConsole');

  var notStrings = [0, undefined, null, /foo|bar/, function () {}, {}];

  afterEach(function () {

    MagiConsole.release();
    MagiConsole.pattern = undefined;
    MagiConsole.level = undefined;
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