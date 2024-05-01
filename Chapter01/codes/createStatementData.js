class PerformanceCaculator {
    constructor(aPerformance, aPlay){
        this.performance = aPerformance;
        this.play = aPlay;
    }

    // 공연 type별 요금계산
    get amount() {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.performance.audience > 30) {
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

    get volumeCredits() {
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

export default function createStatementData(invoice, plays){
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalVolumeCredit = totalVolumeCredit(result);
    result.totalAmount = totalAmount(result);
    return result;

    function enrichPerformance(aPerformance){
        const caculator = new PerformanceCaculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = caculator.amount;
        result.volumeCredits = caculator.volumeCredits;
        return result;
    }
    
    // 공연(performance) 제목(playID) 에 해당하는 공연정보(play) 를 가져옴
    function playFor(aPerformance){
        return plays[aPerformance.playID];
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