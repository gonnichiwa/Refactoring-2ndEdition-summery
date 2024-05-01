class PerformanceCaculator {
    constructor(aPerformance, aPlay){
        this.performance = aPerformance;
        this.play = aPlay;
    }

    get amount() {
        throw new Error(`서브 클래스에서 처리하도록 설계되었음.`);
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCaculator extends PerformanceCaculator {
    // override 됨
    get amount() {
        let result = 0;
        result = 40000;
        if (this.performance.audience > 30) {
            result += 1000 * (this.performance.audience - 30);
        }
        return result;
    }
}
class ComedyCaculator extends PerformanceCaculator {
    // override 됨
    get amount() {
        let result = 0;
        result = 30000; // 기본료
        if (this.performance.audience > 20) { // 20명까진 기본이용
            result += 10000 + 500 * (this.performance.audience - 20); // 추가인원
        }
        result += 300 * this.performance.audience; // comedy 특별추가요금
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
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
        const caculator = createPerformanceCaculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = caculator.amount;
        result.volumeCredits = caculator.volumeCredits;
        return result;
    }

    // 공연 type별 요금 계산
    function createPerformanceCaculator(aPerformance, aPlay){
        switch(aPlay.type){
            case "tragedy" : return new TragedyCaculator(aPerformance, aPlay);
            case "comedy" : return new ComedyCaculator(aPerformance, aPlay);
            default: 
              throw new Error(`알 수 없는 장르: ${this.play.type}`);
        }
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