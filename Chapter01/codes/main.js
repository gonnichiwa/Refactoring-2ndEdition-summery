import createStatementData from './createStatementData.js'

// 연극 정보
const invoice = {
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
const plays = {
    "hamlet" : {"name" : "Hamlet", "type": "tragedy"},
    "as-like" : {"name" : "as-like", "type": "comedy"},
    "athello" : {"name" : "athello", "type": "tragedy"},
};


// 공연료 청구서를 출력
function statement(invoice, plays) {
    // return renderHTML(createStatementData(invoice, plays));
    return renderPlainText(createStatementData(invoice, plays));
    
    function renderPlainText(data) {
        let result = `청구 내역 (고객명: ${data.customer})\n`;
        for (let perf of data.performances) {
            result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
        }
        result += `총액: ${usd(data.totalAmount)}\n`;
        result += `적립 포인트 : ${data.totalVolumeCredit}점 \n`;
        return result;
    }

    function renderHTML(data){
        let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
        result += "<table>\n";
        result += "<tr><th>연극</th><th>좌석수</th><th>금액</th><tr>";
        for (let perf of data.performances) {
            result += `<tr><td>${perf.play.name}:</td><td>${usd(perf.amount)}</td><td>(${perf.audience}석)</td></tr>\n`;
        }
        result += "</table>";
        result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
        result += `<p>적립 포인트 : <em>${data.totalVolumeCredit}</em>점</p>\n`;
        return result;
    }

    function usd(aNumber){
        return new Intl.NumberFormat("en-US",
                            {style: "currency", currency: "USD",
                            minimumFractionDigits: 2 }).format(aNumber / 100);
    }

}// statement

const result = statement(invoice, plays);
console.log(result);
// result
// 청구 내역 (고객명: BigCo)
// Hamlet: $650.00 (55석)
// as-like: $580.00 (35석)
// athello: $500.00 (40석)
// 총액: $1,730.00
// 적립 포인트 : 47점
