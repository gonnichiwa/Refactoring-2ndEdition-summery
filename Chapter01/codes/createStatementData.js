export default function createStatementData(invoice, plays){
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalVolumeCredit = totalVolumeCredit(result);
    result.totalAmount = totalAmount(result);
    return result;

    function enrichPerformance(aPerformance){
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }
    
    // 공연(performance) 제목(playID) 에 해당하는 공연정보(play) 를 가져옴
    function playFor(aPerformance){
        return plays[aPerformance.playID];
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
    
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }
    
    function totalVolumeCredit(data){
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0); // 반복문을 파이프라인으로 바꾸기.
    }
    
    function totalAmount(data){
        return data.performances
            .reduce((total, p) => total + p.amount, 0); // 반복문을 파이프라인으로 바꾸기.
    }
    
}