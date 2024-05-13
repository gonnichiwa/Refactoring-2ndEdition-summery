
export function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

function plumage(bird) { // 깃털 상태
    return createBird(bird).plumage;
}

function airSpeedVelocity(bird){ // 비행 속도
    return createBird(bird).airSpeedVelocity;
}

function createBird(bird) { // 인스턴스 생성 팩토리
    switch(bird.type) {
        case '유럽제비':
            return new EuropeanSwallow(bird);
        case '아프리카제비':
            return new AfricanSwallow(bird);
        case '노르웨이파랑앵무':
            return new NorwegianBlueParrot(bird);
        default:
            return new Bird(bird);
    }
}

class Bird {
    constructor(bird){
        Object.assign(this, bird);
    }

    get plumage() { // 깃털 상태
        return 'unknown bird';
    }
    
    get airSpeedVelocity(){ // 비행 속도
        return null;
    }
}

class EuropeanSwallow extends Bird { // 유럽제비
    get plumage() { // 깃털 상태
        return '보통임';
    }
    
    get airSpeedVelocity(){ // 비행 속도
        return 35;
    }
}

class AfricanSwallow extends Bird {
    get plumage() { // 깃털 상태
        return (this.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
    }
    
    get airSpeedVelocity(){ // 비행 속도
        return 40 - (2 * this.numberOfCoconuts);
    }
}

class NorwegianBlueParrot extends Bird {
    get plumage() { // 깃털 상태
        return (this.voltage > 100) ? '그을렸다': '예쁘다';
    }
    
    get airSpeedVelocity(){ // 비행 속도
        return (this.isNailed) ? 0 : 10 + (this.voltage / 10);
    }
}