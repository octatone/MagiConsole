[![NPM version](https://badge.fury.io/js/magiconsole.svg)](http://badge.fury.io/js/magiconsole)
[![Code Climate](https://codeclimate.com/github/octatone/MagiConsole.png)](https://codeclimate.com/github/octatone/MagiConsole)
[![Build Status](https://travis-ci.org/octatone/MagiConsole.svg?branch=master)](https://travis-ci.org/octatone/MagiConsole)
[![Dependency Status](https://david-dm.org/octatone/MagiConsole.png?theme=shields.io)](https://david-dm.org/octatone/MagiConsole)


# MagiConsole

A magical namespaced console wrapper.

## Usage

Require MagiConsole and create some namespaced console objects:
```javascript
var MagiConsole = require('magiconsole');

var fooConsole = new MagiConsole('foo');
var barConsole = new MagiConsole('bar');
```

The MagiConsole constructor caches namespaced instances.  You can require and create namespaced consoles throughout your project, but only one object instance will be created per namespace.

### Namespaces

By default nothing is output from magiconsole:
```javascript
fooConsole.log('bar');
barConsole.log('foo');
```
(nothing is output to the console)

Enable magiconsole namespaces with regex patterns:
```javascript
// setup namespace regex pattern:
MagiConsole.log('bar');

barConsole.log('foo');
fooConsole.log('bar');
```
```text
> foo
```

Enable all namespaces with a special wildcard string:
```javascript
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.log('bar');
```
```text
> foo
> bar
```

Enable namespaces via environment variables:
```text
> MLOG=foo node fooAndBarLogs.js
```

### MagiConsole.log

Sets the current regex pattern namespaces are tested against.

`MagiConsole.log('network|db')` will allow all namespaces containing 'network' or 'db'.

`MagiConsole.log('^file')` will allow all namespaces starting with 'file'.

`MagiConsole.log('^(?!io).+') will allow all namespaces that do not start with 'io'.

### Log Levels

MagiConsole wraps *all* methods normally available via `console` including `log`, `dir`, `warn`, and `info`.

By default all methods are enabled to write to the console.

Whitelist a log level:
```javascript
MagiConsole.setLevel('warn');
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.warn('bar');
```
```text
> bar
```

Reenable all console methods:
```javascript
MagiConsole.setLevel('*');
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.warn('bar');
```
```text
> foo
> bar
```

Set log level via environment variable:
```text
> MLEVEL=info node allSortsOfMagiConsoleMethods.js
```

## Environment Variables

MagiConsole can be configured via the command line using envinronment variables:

  - `MLOG` sets the namespace regex pattern

  - `MLEVEL` sets the loglevel

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
