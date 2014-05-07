[![NPM version](https://badge.fury.io/js/magiconsole.png)](http://badge.fury.io/js/magiconsole)
[![Dependency Status](https://david-dm.org/octatone/MagiConsole.png?theme=shields.io)](https://david-dm.org/octatone/MagiConsole)
[![Build Status](https://travis-ci.org/octatone/MagiConsole.png?branch=master)](https://travis-ci.org/octatone/MagiConsole)
[![Code Climate](https://codeclimate.com/github/octatone/MagiConsole.png)](https://codeclimate.com/github/octatone/MagiConsole)
[![Code Climate Coverage](https://codeclimate.com/github/octatone/MagiConsole/coverage.png)](https://codeclimate.com/github/octatone/MagiConsole)


# MagiConsole

A magical namespaced console wrapper with loglevel support for node.js and the browser.

## Usage

Require or include MagiConsole and create some namespaced console objects:

### Node
```javascript
var MagiConsole = require('magiconsole');
```

### Browser
```html
<script TYPE="text/javascript" src="MagiConsole.min.js"></script>
```
Once the script is loaded, MagiConsole is available on window.
You can also require MagiConsole.js with your favorite AMD loader.

```javascript
var ioConsole = new MagiConsole('IO');
var dbConsole = new MagiConsole('DB');
```

The MagiConsole constructor caches namespaced instances.
You can require and create namespaced consoles throughout your project,
but only one object instance will be created per namespace.

### Namespaces

By default nothing is output from magiconsole:
```javascript
ioConsole.info('web socket connected');
dbConsole.info('useing indexeddb');
```
(nothing is output to the console)

Enable MagiConsole namespaces with regex patterns:
```javascript
// setup namespace regex pattern:
MagiConsole.setPattern('IO');

ioConsole.error('socket error');
dbConsole.warn('table not found');
```
```text
> [IO] socket error
```

Enable all namespaces with a special wildcard string:
```javascript
MagiConsole.setPattern('*');

ioConsole.debug('200 OK');
dbConsole.log('all data loaded');
```
```text
> [IO] 200 OK
> [DB] all data loaded
```

Enable namespaces via environment variables:
```text
> MLOG=foo node fooAndBarLogs.js
```

### MagiConsole.setPattern

Sets the current regex pattern namespaces are tested against.

`MagiConsole.setPattern('network|db')` will allow all namespaces containing 'network' or 'db'.

`MagiConsole.setPattern('^file')` will allow all namespaces starting with 'file'.

`MagiConsole.setPattern('^(?!io).+')` will allow all namespaces that do not start with 'io'.

### Log Levels

MagiConsole wraps *all* methods normally available via `console` in modern
browsers and ensures that the leveled methods `error`, `warn`, `log`, `info` and `debug` are always
available both in the browser and node.

By default no log level is set and all methods are enabled to write
to the console.

Set a log level and allow only messages of the same or greater severity:
```javascript
var onlyThisLevel = false;
MagiConsole.setLevel('warn', onlyThisLevel);
MagiConsole.setPattern('*');

ioConsole.warn('a warning');
dbConsole.error('an error');
ioConsole.debug('a boring debug message');
```
```text
> [IO] a warning
> [DB] an error
```

Whitelist a loglevel:
```javascript
var onlyThisLevel = true;
MagiConsole.setLevel('warn', onlyThisLevel);
MagiConsole.setPattern('*');

ioConsole.log('connected to foo.b.ar');
dbConsole.warn('write not completed within 100ms');
```
```text
> [IO] connected to foo.b.ar
```

Reenable all console methods:
```javascript
MagiConsole.setLevel('*');
MagiConsole.setPattern('*');

ioConsole.log('connecting ...');
dbConsole.warn('store not found');
```
```text
> [IO] connecting ...
> [DB] store not found
```

Set log level via environment variable:
```text
> MLEVEL=info node allSortsOfMagiConsoleMethods.js
```

### Reset

Reset MagiConsole to the default state of not logging anything:
```javascript
MagiConsole.reset();
```

## Environment Variables

MagiConsole can be configured via the command line using environment variables:

  - `MLOG` sets the namespace regex pattern

  - `MLEVEL` sets the loglevel

  - `MLEVELONLY` set to only allow the loglevel and no other severities

## Develop and contribute

You need to have node and npm installed. Then fork this repo and open it in your terminal.

### Install dependencies

    $ make install

### Run tests

    $ make test

### Run tests and watch for changes

    $ make start

### Generate coverage report

    $ make coverage

### Run JSLint

    $ make lint

### Build for distribution

    $ make build

### Resources
  - [Chai BDD API](http://chaijs.com/api/bdd)
  - [Sinon Chai docs](https://github.com/domenic/sinon-chai)
