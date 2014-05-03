# MagiConsole

A magical namespaced `console` wrapper.

## Usage

Require the magiconsole constructor module and create some namespaced magiconsole objects:
```javascript
var Console = require('magiconsole');

var fooConsole = new Console('foo');
var barConsole = new Console('bar');
```

By default nothing is output from magiconsole:
```javascript
fooConsole.log('bar');
barConsole.log('foo');
```
(nothing is output to the console)

You can enable magiconsole namespaces with regex patterns:
```javascript
Console.log('bar');
barConsole.log('foo');
fooConsole.log('bar');
```
```text
> foo
```

You can enable all namespaces with a special wildcard string:
```javascript
Console.log('*');
barConsole.log('foo');
fooConsole.log('bar');
```
```text
> foo
> bar
```

You can enable namespaces via environment variables:
```text
> MLOG=foo node fooAndBarLogs.js
```

magiconsole wraps *all* methods normally available via `console` including `log`, `dir`, `warn`, and `info`.


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
