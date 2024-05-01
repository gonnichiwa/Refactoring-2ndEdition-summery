# Chapter01 - 리팩터링: 첫번째 예시

`main.js` 예제 기준 리팩터링 맛보기 진행  

> 커밋 기준으로 진행

### 최초 생성 : `f809530` (24-04-30)
- 사람은 코드의 미적 상태에 민감함.
- 설계가 나쁜 시스템은 수정하기 어렵다.
- 읽기 어려운 코드는 수정하기도 어렵다.
- 여러 함수와 프로그램 요소로 재구성 한다.
- 구조가 빈약하면 수정하기 어렵다

<br/>

- 여러 개발 기법들이 버그 발생여지를 최소화 한다 해도 실제 작업은 사람이 하는 일
- 그래서 테스트의 역할은 중요함.
- 항상 테스트 자동화 해야함
- 테스트 프레임워크를 이용하여 모든 테스트는 단축키 하나로 실행할 수 있도록 설정함.
- 이런 내용은 `Chapter04`에서 제시함

> 리팩터링 하기전에 제대로 된 테스트부터 마련한다. 테스트는 반드시 자가진단(유닛테스트, 통합테스트) 하도록 만듬.

> 요구사항은 한두개씩 들어오지 않는다, 한부대 단위로 들어온다.

- HTML로 출력하도록 요구사항이 들어와서 본 코드를 고칠려고 하면 너무 힘들다.

+ 복잡한 로직의 작업에 앞서 해야 할 것은
  1. 레거시의 테스트 환경을 갖추고
  2. 테스트에 맞게 입력과 출력의 정합성을 확인한 다음
  3. 함수를 쪼개고
  4. 쪼개는 작업 단위마다 테스트를 돌림  
- 아래 내용들은 위 `1.`, `2.` 완수 되었다는 가정 하 진행함.
- 사실 간단한 코드라서 그냥 콘솔에서 돌려도 무방하기 때문에 위 `1.`, `2.`는 완수 되었다고 봐도 무방함.


### statement() 함수 쪼개기 `c744fd8` (24-04-30)

- 전체 동작을 각각의 부분으로 나눌 수 있는 지점을 찾음.
- switch문을 예시로 함.
- 어느 IDE던 코드 덩어리 블록치고 우클릭해서 Refactor.. 해서 함수로 빼는 기능이 있음. **함수 추출하기**  
- 함수로 빼면서 이름지정해주면 그대로 분리됨.

<br/>

- 함수 추출 이후 지금보다 더 명확하게 표현할 수 있는 간단한 방법은 없는지? 검토해봄
- 예시로는 `thisAmount`를 `result`로 변경함.
- 단위 함수의 반환값이므로
- 컴파일, 테스트, 커밋.

### statement() 함수 쪼개기2 : 좀 더 명확한 이름으로 변경 `c744fd8` (24-04-30)

- 저자의 코딩스타일에 따라 처리함.
- js와 같은 동적타입언어를 사용할 때는 변수명에 타입이 드러나게 작성하면 도움됨.
- 파라미터 이름에 접두어로 타입이름을 적는다던지
- `perf`처럼 역할이 뚜렷하지 않을 때는 부정관사(a/an)를 붙임.

> 컴퓨터가 이해하는 코드는 바보도 작성할 수 있다. 사람이 이해하도록 작성하는 프로그래머가 진정한 실력자란다

### play 변수 제거하기 `4eaa439` (24-04-30)

```js
invoice = {
    "customer" : "BigCo",
    "performances" : [
        {
            "playID" : "hamlet",
            "audience" : 55
        },
        ...

plays = {
    "hamlet" : {"name" : "Hamlet", "type": "tragedy"},
    ...

for(let perf of invoice.performances){
        const play = plays[perf.playID];
        // 공연 type별 요금계산
        let thisAmount = amountFor(play, perf);
```
- `play`는 개별 공연(`perf`)에서 얻으므로 amountFor()의 인자로 전달할 필요가 없음
- 긴 함수를 잘개 쪼갤 때, `play` 같은 변수를 최대한 제거함.
- 임시 변수들때문에 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 복잡해짐.
- 이런 종류의 리팩터링은 `7장 임시 변수를 질의 함수로 바꾸기` 가 있음.

### 임시변수화된 thisAmount의 인라인 처리 `79659b9` (24-04-30)

```js
for(let perf of invoice.performances){
        // 공연 type별 요금계산
        let thisAmount = amountFor(perf);

        // 포인트 적립
        volumeCredits += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명 마다 추가 포인트를 제공한다.
        if("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        // 청구 내역을 출력
        result += `${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }
```
- `thisAmount`도 임시변수화 되었으니 인라인 처리한다.


### 적립 포인트 계산 코드 추출하기 `f02aef8` (24-04-30)
- 앞서 분리한 `amountFor(perf)`와 같은 방법으로 함수 추출


### format 변수 제거하기 `f7763d0` (24-04-30)

```js
const format = new Intl.NumberFormat("en-US",
                        {style: "currency", currency: "USD",
                        minimumFractionDigits: 2}).format;

for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);

    // 청구 내역을 출력
    result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
}
```

- 임시변수는 문제를 일으킬 수 있다.
- 임시변수는 자신이 속한 루틴에서만 의미가 있어서 루틴이 길고 복잡해질 수 있음.
- 함수로 분리했으나 `format` 이름을 그대로 놔두기엔 좀 애매함.
- `format`이라는 이름은 함수가 하는 일을 충분히 설명하지 못하므로.
- `format`을 `usd`로 이름 바꾸고 `${format(amountFor(perf)/100)}` 같이 계산 결과값을 변경하는 로직또한 추출한 함수 내에서 계산하도록 함



### volumeCredits 변수 제거 `1a3ff69` (24-04-30)

```js
let volumeCredits = 0;
...
...
for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);

    // 청구 내역을 출력
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
}
```

1. for 안에 있는 변수 `volumeCredits` 는 반복문 안에서 누적되는 값이므로 까다롭다.
2. 반복문 쪼개기(Chapter8)로 VolumeCredits 누적되는 부분을 따로 빼냄
3. 이후 `let volumeCredits = 0;` 으로 초기화 한 라인을 반복문 쪼갠 코드 앞으로 슬라이드하고 보면 인라인 처리하기 수월 해 보임.
- 아래 코드는 위 `1.` ~ `3.` 을 진행한 코드임.

```js
for(let perf of invoice.performances){
        // 청구 내역을 출력
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
}

let volumeCredits = 0;
for(let perf of invoice.performances){
    volumeCredits += volumeCreditsFor(perf);
}
```

에서

```js
let volumeCredits = totalVolumeCredit(invoice);
result += `적립 포인트 : ${volumeCredits}점 \n`;

...

function totalVolumeCredit(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}
```

위처럼 함수 추출 한 뒤

```js
result += `적립 포인트 : ${totalVolumeCredit(invoice)}점 \n`;
```

인라인 처리함.


### totalAmount 변수 제거 `ae70eb2` (24-04-30)

- 바로 위 언급한 `totalVolumeCredit()` 과 같은 절차로 제거함.

<br/>

### 여기까지 한 뒤 statement() 보면..

```js
function statement(invoice) {
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    for(let perf of invoice.performances){
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    }
    result += `총액: ${usd(totalAmount(invoice))}\n`;
    result += `적립 포인트 : ${totalVolumeCredit(invoice)}점 \n`;
    return result;

    ... 이후 함수 분리한것들..
```

+ 여기까지 리팩토링의 초기단계.
  - 논리적인 요소를 파악하기 쉽도록 함.
  - 복잡하게 얽힌 덩어리를 `잘게 쪼개는 작업`은 `이름을 잘 짓는 일`만큼 중요함.

+ 이제 statement()의 HTML 버전 만들려면..
  - 일곱줄짜리 최상단 코드만 HTML로 표현되도록 바꾸면 됨.


### 중간정보 처리자 statementData 생성 `370d4ff` (24-04-30)

```js
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;

    return renderPlainText(statementData, plays);

    function renderPlainText(data, plays) {
        let result = `청구 내역 (고객명: ${data.customer})\n`;
        for (let perf of data.performances) {
            result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        }
        result += `총액: ${usd(totalAmount(data))}\n`;
        result += `적립 포인트 : ${totalVolumeCredit(data)}점 \n`;
        return result;
    }
    ...
    ...
```
- `statementData` 를 추가해서 이를 중간에서 데이터 전달하는 역할로 수행하도록 함.


### 계산부와 출력부의 분리. `370d4ff` ~ `553a7fb`

- 코드량이 늘었다.
+ 늘게 된 주된 원인 
  - 함수 본문을 열고 닫는 괄호가 덧붙었음.
  - 함수 선언문 역시 추가 됨.
- 코드 량이 늘기만 했으면 안좋지만, 추가된 코드 덕에 전체 로직을 구성하는 요소가 뚜렷이 부각됨.
- `계산하는 부분`과 `출력 형식`을 다루는 부분이 분리됨.

> `간결함`이 `지혜의 정수` 일지는 몰라도  
> `명료함`이 `진화할 수 있는 프로그램`의 정수임.


### 다형성을 활용해 계산 코드 재구성 하기 `4d6e0dd` (24-05-01)

```js
function amountFor(aPerformance) {
        let result = 0; // 명확한 이름으로 변경 : 함수의 결과값 변수 이름은 result
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000; // 기본료
                if (aPerformance.audience > 20) { // 20명까진 기본이용
                    result += 10000 + 500 * (aPerformance.audience - 20); // 추가인원
                }
                result += 300 * aPerformance.audience; // comedy 특별추가요금
                break;
            default:
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
        }
        return result;
    }
```

- `amountFor(aPerformance)`를 보면, 연극 장르(`aPerformance.play.type`) 마다 공연료와 적립포인트 계산을 다르게 지정하도록 함

- 조건문 (if, switch)를 명확한 구조로 보완하는 방법은 다양하나, 여기서는 `다형성`을 활용하는것이 자연스러워 보인다.

+ 작업목표 : 
  - 상속 계층을 구성해서 `희극(comedy)` 과 `비극(tragedy)` 서브클래스가 각자의 구체적인 계산 로직을 정의함.
  - 그래서 `희극`과 `비극` 서브클래스에 따라 정확한 계산 로직을 연결함. (언어 차원에서 처리)
  - 적립포인트 계산도 비슷한 구조로 만들것임.

- `createStatementData.js` 의 코드가 리팩터링 대상.


### 공연료 계산기 만들기

```js
// createStatementData.js
class PerformanceCaculator {
    constructor(aPerformance){
        this.performance = aPerformance;
    }
}
```

```js
function enrichPerformance(aPerformance){
    const caculator = new PerformanceCaculator(aPerformance);
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}
```

- 컴파일, 빌드, 테스트.

```shell
$ node main.js
청구 내역 (고객명: BigCo)
Hamlet: $650.00 (55석)
as-like: $580.00 (35석)
athello: $500.00 (40석)
총액: $1,730.00
적립 포인트 : 47점
```

### 그리고 공연 정보를 계산기로 전달. `a157474` (24-05-01)

```js
// createStatementData.js
function enrichPerformance(aPerformance){
    const caculator = new PerformanceCaculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}
```


```js
// createStatementData.js
class PerformanceCaculator {
    constructor(aPerformance, aPlay){
        this.performance = aPerformance;
        this.aPlay = aPlay;
    }
}
```

### 새로 생성한 `PerformanceCaculator`에 amountFor를 넣는다 `d101943` (24-05-01)

```js
class PerformanceCaculator {
    constructor(aPerformance, aPlay){
        this.performance = aPerformance;
        this.play = aPlay;
    }

    // 공연 type별 요금계산
    get amount() {
        let result = 0;
        switch (this.play.type) { // aPlay.type -> this.play.type
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) { // aPerformance -> this.performance
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000; // 기본료
                if (this.performance.audience > 20) { // 20명까진 기본이용
                    result += 10000 + 500 * (this.performance.audience - 20); // 추가인원
                }
                result += 300 * this.performance.audience; // comedy 특별추가요금
                break;
            default:
                throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }
        return result;
    }
}
```

- 기존 사용중인 `amountFor(aPerformance)` 에도 신규 생성한 객체를 사용토록 해본다.

```js
//to be
function amountFor(aPerformance) {
    return new PerformanceCaculator(aPerformance, playFor(aPerformance)).amount;
}
```

- 컴파일, 테스트, 커밋

### 적립 포인트 계산하는 함수도 같은 절차대로 `PerformanceCaculator` 객체로 뺀다

