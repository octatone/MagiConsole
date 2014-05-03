# MagiConsole

A magical namespaced console wrapper.

## Usage

Require the magiconsole constructor module and create some namespaced magiconsole objects:
```javascript
var MagiConsole = require('magiconsole');

var fooConsole = new Console('foo');
var barConsole = new Console('bar');
```

The MagiConsole constructor caches namespaced instances so you can require and create
namespaced consoles throughout your project without actually creating new objects.

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
