
export function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

function plumage(bird) { // 깃털 상태
    return new Bird(bird).plumage;
}

function airSpeedVelocity(bird){ // 비행 속도
    return new Bird(bird).airSpeedVelocity;
}

export class Bird {
    constructor(bird){
        Object.assign(this, bird);
    }

    get plumage() { // 깃털 상태
        switch(this.type){
            case '유럽제비':
                return '보통임';
            case '아프리카제비':
                return (this.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
            case '노르웨이파랑앵무':
                return (this.voltage > 100) ? '그을렸다': '예쁘다';
            default:
                return '알수없다';
        }
    }
    
    get airSpeedVelocity(){ // 비행 속도
        switch(this.type){
            case '유럽제비':
                return 35;
            case '아프리카제비':
                return 40 - (2 * this.numberOfCoconuts);
            case '노르웨이파랑앵무':
                return (this.isNailed) ? 0 : 10 + (this.voltage / 10);
            default:
                return null;
        }
    }
}