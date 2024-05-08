import sayHello from "../source/app.js";

describe('app.spec.js', function () {
    it('sayHello should return hello', function (done) {
      if (sayHello() === 'hello') {
        done();
      }
    });
  });