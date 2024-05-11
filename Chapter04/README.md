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
    "chai": "^5.1.0",
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

  sample.spec.js - Province
    ✔ shortfall - using assert
    ✔ shortfall - using chai

  3 passing (5ms)
```

<br/>



## beforeEach로 given 데이터 test unit들 각자 참조하여 실행되도록

```js
import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js - Province', function(){
    it('shortfall - using assert', function(){
        const asia = new Province(sampleProvinceData());
        assert.equal(asia.shortfall, 5);
    });
    it('shortfall - using chai', function(){
        const asia = new Province(sampleProvinceData());
        expect(asia.shortfall).equal(5);
    });
});
```

- 모듈(`sample.js`) 에 대한 테스트는 여러개가 될 수 있겠다.
- 현재 본 모듈의 테스트들은 모두 `Province` 로 생성된 객체를 `asia`에 할당시킨 뒤 비즈로직(`shortfall`)실행 결과 데이터가 올바른지를 테스트 하고 있음.
- 테스트들 모두 `asia`를 쓰고 있고 테스트 코드도 중복은 좀 피할 필요가 있음.
- 중복 없앨 대상 코드 `let asia = new Province(sampleProvinceData());`


### 그렇다고 이렇게 하면 안됨

```js
import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js - Province', function(){
    const asia = new Province(sampleProvinceData()); // 이렇게 만들면 안됨
    it('shortfall - using assert', function(){
        assert.equal(asia.shortfall, 5);
    });
    it('shortfall - using chai', function(){
        expect(asia.shortfall).equal(5);
    });
});
```

- 코드 겉으로 보기에는 asia를 공유하는 것 처럼 보이나
- 향후 테스트 코드가 계속 추가될 때 `asia` 에 어떤 변형을 시도하거나 프로퍼티 추가가 일어나 테스트가 찾기 어려운 이유로 깨질 지 알 수 없음.


### 그래서 아래처럼 쓴다 beforeEach()

```js
import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js - Province', function(){
    let asia;
    beforeEach(function(){ // 이렇게
        asia = new Province(sampleProvinceData());
    });
    it('shortfall - using assert', function(){
        assert.equal(asia.shortfall, 5);
    });
    it('shortfall - using chai', function(){
        expect(asia.shortfall).equal(5);
    });
});
```

- `beforeEach(func)` : 각각의 테스트 케이스들 (`it`함수들) 독립적으로 `asia`를 할당시켜 실행 가능하도록 함.
- shortfall - using assert 테스트와 shortfall - using chai 테스트 따로따로 `asia = new Province(..)` 를 실행해서 동작하도록 함.

- `afterEach`, `after`, `before` 등이 있고 이런 함수들을 `Hooks`라고 하더라.