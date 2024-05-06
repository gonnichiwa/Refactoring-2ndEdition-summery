const sayHello = require('../app').sayHello;

describe('App test!', function () {
    it('sayHello should return hello', function (done) {
      if (sayHello() === 'hello') {
        done();
      }
    });
  });