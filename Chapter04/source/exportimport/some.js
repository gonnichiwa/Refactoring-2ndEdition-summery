export default class User { // default 하나의 모듈(some.js) 에서 하나의 객체(User)만 내보낸다.
    constructor(name) {
      this.name = name;
    }
    sayHello(){
      console.log(this.name);
    }
  }