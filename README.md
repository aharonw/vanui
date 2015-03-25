Modern VAN Interface
==========================

### Install packages
```shell
$ npm install
```

### Compile js
```shell
$ watchify -t coffeeify -t jadeify src/van.coffee -o build/van.js -v
```

### Watch stylus files
```shell
$ stylus -w src/styles/ -o css/
```