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
function statement(invoice, plays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US",
                            {style: "currency", currency: "USD",
                            minimumFractionDigits: 2}).format;
    
    for(let perf of invoice.performances){
        const play = plays[perf.playID];
        let thisAmount = 0;

        switch(play.type){
            case "tragedy":
                thisAmount = 40000;
                if(perf.audience > 30){
                    thisAmount += 1000 * (perf.audience - 30);
                }
            break;
            case "comedy":
                thisAmount = 30000;
                if(perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`알 수 없는 장르: ${play.type}`);
        }

        // 포인트 적립
        volumeCredits += Math.max(perf.audience - 30, 0);
        // 희극 관객 5명 마다 추가 포인트를 제공한다.
        if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

        // 청구 내역을 출력
        result += `${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
        totalAmount += thisAmount;
    }
    result += `총액: ${format(totalAmount/100)}`;
    result += `적립 포인트 : ${volumeCredits}점 \n`;
    return result;
}

result = statement(invoice, plays);
console.log(result);
```result
청구 내역 (고객명: BigCo)
Hamlet: $650.00 (55석)
as-like: $580.00 (35석)
athello: $500.00 (40석)
총액: $1,730.00적립 포인트 : 47점
```
