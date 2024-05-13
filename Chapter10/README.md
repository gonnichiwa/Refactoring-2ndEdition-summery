
# Chapter 10 조건부 로직 간소화

## 10.4 조건부 로직을 다형성으로 바꾸기

- 복잡한 switch, if문같은 조건부 로직은 해석하기 가장 난해한 대상.
- 직관적으로 구조화 하는 방법을 항상 고민함.

+ 책,음악,음식같은 대상의 **타입**
  - case별로 클래스 하나씩 만듬.
  - 공통 switch 로직의 중복 삭제

+ 기본 동작을 위한 case문과 그 변형 동작 : 가장 일반적이고 직관적

- 그렇다고 모든 조건부 로직을 다형성으로 대체해야 하는건 쫌..
- 조건부 로직 대부분은 if/else, switch/case로 이뤄짐.
- 복잡한 조건부 로직은 다형성이 막강한 도구


### source (source/chapter10-4.js)
---
<br/>

```js
// chapter10-4.js
export function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

function plumage(bird) { // 깃털 상태
    switch(bird.type){
        case '유럽제비':
            return '보통임';
        case '아프리카제비':
            return (bird.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
        case '노르웨이파랑앵무':
            return (bird.voltage > 100) ? '그을렸다': '예쁘다';
        default:
            return '알수없다';
    }
}

function airSpeedVelocity(bird){ // 비행 속도
    switch(bird.type){
        case '유럽제비':
            return 35;
        case '아프리카제비':
            return 40 - (2 * bird.numberOfCoconuts);
        case '노르웨이파랑앵무':
            return (bird.isNailed) ? 0 : 10 + (bird.voltage / 10);
        default:
            return null;
    }
}
```

### tests (/test/chapter10-4.spec.js)

---
<br/>

```js
import * as sample from '../source/chapter10-4.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('chapter10-4.spec.js', function() {
    let data;
    beforeEach(function() {
        // given
        data = [
            { name: 'jebiname', type: '유럽제비' },
            { name: 'africajebiname', type: '아프리카제비', numberOfCoconuts: 4, },
            { name: 'norwayparangname',
              type: '노르웨이파랑앵무',
              voltage: 200 },
            { name: 'norwayparangname22', 
              type: '노르웨이파랑앵무',
              voltage: 50,
              isNailed: false },
            { name: 'chambird', type: '참새' }
        ];
    });
    it('plumages count', function() {
        // when
        const plumages = sample.plumages(data);
        // then
        expect(plumages.size).equal(data.length);
    });
    it('plumages name and value check', function() {
        // when
        const plumages = sample.plumages(data);
        // then
        expect(plumages.get('africajebiname')).equal('지쳤다');
        expect(plumages.get('norwayparangname')).equal('그을렸다');
    });
    it('speeds', function() {
        // when
        const bSpeeds = sample.speeds(data);
        // then
        expect(bSpeeds.get('africajebiname')).equal(32);
        expect(bSpeeds.get('norwayparangname22')).equal(15);
        expect(bSpeeds.get('chambird')).equal(null);
    });
});
```

```sh
PS C:..\Chapter10> npm run test

> test
> mocha

  chapter10-4.spec.js
    ✔ plumages count
    ✔ plumages name and value check
    ✔ speeds
```

### 조건문 메소드 객체화

```js
// source/chapter10-4.js
function plumage(bird) { // 깃털 상태
    return new Bird(bird).plumage;
}

function airSpeedVelocity(bird){ // 비행 속도
    return new Bird(bird).airSpeedVelocity;
}
...

class Bird {
    constructor(bird){
        Object.assign(this, bird);
    }

    get plumage() { // 깃털 상태
        switch(this.type) {
            case '유럽제비':
                return '보통이다';
            case '아프리카제비':
                return (this.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
            case '노르웨이파랑앵무':
                return (this.voltage > 100) ? '그을렸다': '예쁘다';
            default:
                return '알수없다';
        }
    }
    
    get airSpeedVelocity(){ // 비행 속도
        ...
    }
}
```

- 컴파일, 테스트, 커밋


### 팩토리 메소드생성, 조건에 따라 서브클래스 인스턴스 쓰도록

```js
/* source/chapter10-4.js */
function plumage(bird) { // 깃털 상태
    return createBird(bird).plumage;
}

function airSpeedVelocity(bird){ // 비행 속도
    return createBird(bird).airSpeedVelocity;
}
...
function createBird(bird) { // 인스턴스 생성 팩토리
    switch(bird.type) {
        case '유럽제비':
            return new EuropeanSwallow(bird);
        case '아프리카제비':
            return new AfricanSwallow(bird);
        case '노르웨이파랑앵무':
            return new NorwegianBlueParrot(bird);
        default:
            return new Bird(bird); 
    }
}

class Bird {
    constructor(bird) {
        Object.assign(this, bird);
    }

    get plumage() { // 깃털 상태
        return 'unknown bird';
    }
    
    get airSpeedVelocity() { // 비행 속도
        return null;
    }
}

class EuropeanSwallow extends Bird { // 유럽제비
    get plumage() { // 깃털 상태
        return '보통임';
    }
    
    get airSpeedVelocity() { // 비행 속도
        return 35;
    }
}

class AfricanSwallow extends Bird {
    get plumage() { // 깃털 상태
        return (this.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
    }
    
    get airSpeedVelocity() { // 비행 속도
        return 40 - (2 * this.numberOfCoconuts);
    }
}

class NorwegianBlueParrot extends Bird {
    get plumage() { // 깃털 상태
        return (this.voltage > 100) ? '그을렸다': '예쁘다';
    }
    
    get airSpeedVelocity() { // 비행 속도
        return (this.isNailed) ? 0 : 10 + (this.voltage / 10);
    }
}
```

- 컴파일, 테스트, 커밋

### 