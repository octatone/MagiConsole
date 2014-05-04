[![NPM version](https://badge.fury.io/js/magiconsole.svg)](http://badge.fury.io/js/magiconsole)
[![Code Climate](https://codeclimate.com/github/octatone/MagiConsole.png)](https://codeclimate.com/github/octatone/MagiConsole)
[![Build Status](https://travis-ci.org/octatone/MagiConsole.svg?branch=master)](https://travis-ci.org/octatone/MagiConsole)
[![Dependency Status](https://david-dm.org/octatone/MagiConsole.png?theme=shields.io)](https://david-dm.org/octatone/MagiConsole)


# MagiConsole

A magical namespaced console wrapper with loglevel support for node.js and the browser.

## Usage

Require MagiConsole and create some namespaced console objects:

### Node
```javascript
var MagiConsole = require('magiconsole');
```

### Browser
```html
<script TYPE="text/javascript" src="MagiConsole.min.js"></script>
```
Once the script is loaded, MagiConsole is available on window.  You can also require MagiConsole.js with AMD loaders

```javascript
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
> [BAR] foo
```

Enable all namespaces with a special wildcard string:
```javascript
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.log('bar');
```
```text
> [BAR] foo
> [FOO] bar
```

Enable namespaces via environment variables:
```text
> MLOG=foo node fooAndBarLogs.js
```

### MagiConsole.log

Sets the current regex pattern namespaces are tested against.

`MagiConsole.log('network|db')` will allow all namespaces containing 'network' or 'db'.

`MagiConsole.log('^file')` will allow all namespaces starting with 'file'.

`MagiConsole.log('^(?!io).+')` will allow all namespaces that do not start with 'io'.

### Log Levels

MagiConsole wraps *all* methods normally available via `console` including `log`, `dir`, `warn`, and `info`.

By default no log level is set and all methods are enabled to write to the console.

Set a log level and allow all messages of greater severity:
```javascript
var onlyThisLevel = false;
MagiConsole.setLevel('warn', onlyThisLevel);
MagiConsole.log('*');

barConsole.warn('a warning');
fooConsole.error('an error');
barConsole.debug('a boring debug message');
```
```text
> [BAR] a warning
> [FOO] an error
```

Whitelist a loglevel:
```javascript
var onlyThisLevel = true;
MagiConsole.setLevel('warn', onlyThisLevel);
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.warn('bar');
```
```text
> [FOO] bar
```

Reenable all console methods:
```javascript
MagiConsole.setLevel('*');
MagiConsole.log('*');

barConsole.log('foo');
fooConsole.warn('bar');
```
```text
> [BAR] foo
> [FOO] bar
```

Set log level via environment variable:
```text
> MLEVEL=info node allSortsOfMagiConsoleMethods.js
```

## Environment Variables

MagiConsole can be configured via the command line using envinronment variables:

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
