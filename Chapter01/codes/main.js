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
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);

    return renderPlainText(statementData);

    ///////

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        return result;
    }

    // 공연(performance) 제목(playID) 에 해당하는 공연정보(play) 를 가져옴
    function playFor(aPerformance){
        return plays[aPerformance.playID];
    }

    function renderPlainText(data) {
        let result = `청구 내역 (고객명: ${data.customer})\n`;
        for (let perf of data.performances) {
            result += `${perf.play.name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        }
        result += `총액: ${usd(totalAmount(data))}\n`;
        result += `적립 포인트 : ${totalVolumeCredit(data)}점 \n`;
        return result;

        function totalAmount(data){
            let result = 0;
            for(let perf of data.performances){
                result += amountFor(perf);
            }
            return result;
        }
    
        function usd(aNumber){
            return new Intl.NumberFormat("en-US",
                                {style: "currency", currency: "USD",
                                minimumFractionDigits: 2 }).format(aNumber / 100);
        }
    
        function totalVolumeCredit(data) {
            let result = 0;
            for (let perf of data.performances) {
                result += volumeCreditsFor(perf);
            }
            return result;
        }
    
        function volumeCreditsFor(perf) {
            let result = 0;
            result += Math.max(perf.audience - 30, 0);
            if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
            return result;
        }
        
        // 공연 type별 요금계산
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
    }
}// statement



result = statement(invoice, plays);
console.log(result);
// result
// 청구 내역 (고객명: BigCo)
// Hamlet: $650.00 (55석)
// as-like: $580.00 (35석)
// athello: $500.00 (40석)
// 총액: $1,730.00적립 포인트 : 47점
