# Chapter 04 테스트 구축하기

## env

- nodejs v20.11.1

## how to exec

- npm install

```sh
$ npm install
added 72 packages, and audited 73 packages in 994ms

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

- package.json 에서 `type: module` 확인

```js
{
  "devDependencies": {
    "mocha": "^10.4.0"
  },
  "scripts": {
    "test": "mocha"
  },
  "type": "module"
}
```



- run test

```sh
$ npm test

> test
> mocha

  app.spec.js
    ✔ sayHello should return hello

  sample.spec.js
    ✔ shortfall


  2 passing (5ms)
```

