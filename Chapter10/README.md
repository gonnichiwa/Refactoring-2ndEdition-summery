
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


### source (source/bird.js)
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

### tests (/test/bird.spec.js)

---
<br/>

```js
import * as sample from '../source/bird.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('bird.spec.js', function() {
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

  bird.spec.js
    ✔ plumages count
    ✔ plumages name and value check
    ✔ speeds
```

### 조건문 메소드 객체화

```js
/* source/bird.js */
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
/* source/bird.js */
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

### map() 호출 메소드 인라인 처리

```js
/* source/bird.js */
export function plumages(birds) {
    return new Map(birds
                    .map(b => createBird(b))
                    .map(bird => [bird.name, bird.plumage])
    );
}

export function speeds(birds) {
    return new Map(birds
                    .map(b => createBird(b))
                    .map(bird => [bird.name, bird.airSpeedVelocity])
    
    );
}

// 삭제
// function plumage(bird) {
//     return createBird(bird).plumage;
// }

// 삭제
// function airSpeedVelocity(bird) {
//     return createBird(bird).airSpeedVelocity;
// }
```


## 10.4.2 변형 동작을 다형성으로 표현하기

- 앞의 예는 계층구조를 종 분류에 맞게 처리함.
- 교과서적인 것.

- 거의 똑같은 객체지만 다른 부분도 있음을 표현할 때
- 실제 레거시 운영 소스 보면 분리하기 헷갈리는 것(그래서 가만 냅두는것)들이 많음

+ 예시) 신용 평가 기관에서 선박의 항해 **투자 등급**을 계산하는 코드
  - 평가기관 : 위험요소, 잠재수익 기준으로 __투자 등급__(A,B) 계산.
  - 위험요소 : _항해경로 조건, 선장의 항해 이력_

### source (source/voyage.js)

```js
export function rating(voyage, history) { // 투자 등급
    // 수익
    const vpf = voyageProfitFactor(voyage, history);
    // 위험
    const vr = voyageRisk(voyage);
    const chr = captainHistoryRisk(voyage, history);
    // 계산과 결과등급 return
    if (vpf * 3 > (vr + chr * 2)) return "A";
    else return "B";
}

function voyageRisk(voyage) { // 항해 경로 위험요소
    let result = 1;
    if(voyage.length > 4) result += 2;
    if(voyage.length > 8) result += voyage.length - 8;
    if(["중국","동인도"].includes(voyage.zone)) result += 4;
    return Math.max(result, 0);
}

function captainHistoryRisk(voyage, history) { // 선장의 항해 이력 위험요소
    let result = 1;
    if(history.length < 5) result += 4;
    result += history.filter(v => v.profit < 0).length;
    if(voyage.zone === "중국" && hasChina(history)) result -= 2;
    return Math.max(result, 0); 
}

function hasChina(history){ // 중국을 경유하는가?
    return history.some(v => "중국" === v.zone);
}

function voyageProfitFactor(voyage, history) { // 수익 요인
    let result = 2;
    if(voyage.zone === "중국") result += 1;
    if(voyage.zone === "동인도") result += 1;
    if(voyage.zone === "중국" && hasChina(history)) {
        result += 3;
        if(history.length > 10) result += 1;
        if(voyage.length > 12) result += 1;
        if(voyage.length > 18) result -= 1;
    }
    else {
        if(history.length > 8) result += 1;
        if(voyage.length > 14) result -= 1;
    }
    return result;
}
```

### test (test/voyage.spec.js)

```js
import * as sample from '../source/voyage.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('voyage.js', function() {
    let voyage1;
    let history1;
    beforeEach(function() {
        // given
        voyage1 = {zone: "서인도", length: 10};
        history1 = [
            {zone: "동인도", profit: 5},
            {zone: "서인도", profit: 15},
            {zone: "중국", profit: -2},
            {zone: "서아프리카", profit: 7}
        ];
    });
    it('rating result', function() {
        // when
        const result = sample.rating(voyage1, history1);
        // then
        expect(result).equal("B");
    });
});
```

- 컴파일, 테스트, 커밋

```js
PS C:...\Chapter10> npm run test
...
  voyage.js
    ✔ rating result

  4 passing (6ms)
```

### 세부 계산을 수행하는 함수들을 먼저 클래스 객체로 옮김 (source/voyage.js)

- 외부에서 호출하는 `rating(voyage, history)` 가 `Rating` 객체 생성하도록
+ `function` 처리하는 `voyageRisk`, `captainHistoryRisk`, `hasChina`, `voyageProfitFactor` 들을 `Rating` 클래스로 옮김.
  - `Rating`에서 새로 만든 value 기능으로 투자등급 나오도록
  - 세부 계산 수행 함수들이 `Rating` 객체 내부에서 수행되도록

```js
// export function rating(voyage, history) { // 투자 등급
//     // 수익
//     const vpf = voyageProfitFactor(voyage, history);
//     // 위험
//     const vr = voyageRisk(voyage);
//     const chr = captainHistoryRisk(voyage, history);
//     // 계산과 결과등급 return
//     if (vpf * 3 > (vr + chr * 2)) return "A";
//     else return "B";
// }

export function rating(voyage, history){
    return new Rating(voyage, history).value;
}


/* 삭제 */
// function voyageRisk(voyage) { // 항해 경로 위험요소
//     let result = 1;
//     if(voyage.length > 4) result += 2;
//     if(voyage.length > 8) result += voyage.length - 8;
//     if(["중국","동인도"].includes(voyage.zone)) result += 4;
//     return Math.max(result, 0);
// }

// function captainHistoryRisk(voyage, history) { // 선장의 항해 이력 위험요소
//     let result = 1;
//     if(history.length < 5) result += 4;
//     result += history.filter(v => v.profit < 0).length;
//     if(voyage.zone === "중국" && hasChina(history)) result -= 2;
//     return Math.max(result, 0); 
// }

// function hasChina(history){ // 중국을 경유하는가?
//     return history.some(v => "중국" === v.zone);
// }

// function voyageProfitFactor(voyage, history) { // 수익 요인
//     let result = 2;
//     if(voyage.zone === "중국") result += 1;
//     if(voyage.zone === "동인도") result += 1;
//     if(voyage.zone === "중국" && hasChina(history)) {
//         result += 3;
//         if(history.length > 10) result += 1;
//         if(voyage.length > 12) result += 1;
//         if(voyage.length > 18) result -= 1;
//     }
//     else {
//         if(history.length > 8) result += 1;
//         if(voyage.length > 14) result -= 1;
//     }
//     return result;
// }

class Rating {
    constructor(voyage, history){
        this.voyage = voyage;
        this.history = history;
    }

    get value(){
        // 수익
        const vpf = this.voyageProfitFactor;
        console.log('vpf:', vpf);
        // 위험
        const vr = this.voyageRisk;
        console.log('vr:', vr);
        const chr = this.captainHistoryRisk;
        console.log('chr:', chr);
        // 계산과 결과등급 return
        if (vpf * 3 > (vr + chr * 2)) return "A";
        else return "B";
    }

    get voyageRisk() { // 항해 경로 위험요소
        let result = 1;
        if(this.voyage.length > 4) result += 2;
        if(this.voyage.length > 8) result += this.voyage.length - 8;
        if(["중국","동인도"].includes(this.voyage.zone)) result += 4;
        return Math.max(result, 0);
    }
    
    get captainHistoryRisk() { // 선장의 항해 이력 위험요소
        let result = 1;
        if(this.history.length < 5) result += 4;
        result += this.history.filter(v => v.profit < 0).length;
        if(this.voyage.zone === "중국" && this.hasChina) result -= 2;
        return Math.max(result, 0); 
    }
    
    get hasChina(){ // 중국을 경유하는가?
        return this.history.some(v => "중국" === v.zone);
    }
    
    get voyageProfitFactor() { // 수익 요인
        let result = 2;
        if(this.voyage.zone === "중국") result += 1;
        if(this.voyage.zone === "동인도") result += 1;
        if(this.voyage.zone === "중국" && this.hasChina) {
            result += 3;
            if(this.history.length > 10) result += 1;
            if(this.voyage.length > 12) result += 1;
            if(this.voyage.length > 18) result -= 1;
        }
        else {
            if(this.history.length > 8) result += 1;
            if(this.voyage.length > 14) result -= 1;
        }
        return result;
    }
}
```

- 컴파일, 테스트, 커밋

```js
PS C:...\Chapter10> npm run test
...
  voyage.js
    ✔ rating result

  4 passing (6ms)
```

