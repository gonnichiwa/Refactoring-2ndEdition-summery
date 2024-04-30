// 연극 정보
invoice = {
    "customer" : "BigCo",
    "performances" : [
        {
            "playID" : "hamlet",
            "audience" : 55
        },
        {
            "playID" : "as-like",
            "audience" : 35
        },
        {
            "playID" : "athello",
            "audience" : 40
        }
    ]
};

// 청구서에 들어갈 데이터
plays = {
    "hamlet" : {"name" : "Hamlet", "type": "tragedy"},
    "as-like" : {"name" : "as-like", "type": "comedy"},
    "athello" : {"name" : "athello", "type": "tragedy"},
};

// 공연료 청구서를 출력
function statement(invoice) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US",
                            {style: "currency", currency: "USD",
                            minimumFractionDigits: 2}).format;
    
    for(let perf of invoice.performances){
        volumeCredits += volumeCreditsFor(perf);

        // 청구 내역을 출력
        result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액: ${format(totalAmount/100)}\n`;
    result += `적립 포인트 : ${volumeCredits}점 \n`;
    return result;
}

function volumeCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
    return result;
}

// 공연 type별 요금계산
function amountFor(aPerformance) {
    let result = 0; // 명확한 이름으로 변경 : 함수의 결과값 변수 이름은 result
    switch (playFor(aPerformance).type) {
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
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
}

// 공연(performance) 제목(playID) 에 해당하는 공연정보(play) 를 가져옴
function playFor(aPerformance){
    return plays[aPerformance.playID];
}

result = statement(invoice, plays);
console.log(result);
// result
// 청구 내역 (고객명: BigCo)
// Hamlet: $650.00 (55석)
// as-like: $580.00 (35석)
// athello: $500.00 (40석)
// 총액: $1,730.00적립 포인트 : 47점
