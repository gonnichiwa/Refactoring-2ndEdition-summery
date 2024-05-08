import User from './some.js';
import * as currency from './currency-functions.js';

const user = new User('John');
user.sayHello();
console.log(currency.canadianToUs(30000)); // 27300