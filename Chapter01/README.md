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


### format 변수 제거하기

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



