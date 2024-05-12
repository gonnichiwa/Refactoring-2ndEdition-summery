
export function plumages(birds) {
    return new Map(birds.map(b => [b.name, plumage(b)]));
}

export function speeds(birds) {
    return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
}

function plumage(bird) { // 깃털 상태
    switch(bird.type){
        case '유럽제비':
            return '보통임';
        case '아프리카제비':
            return (bird.numberOfCoconuts > 2) ? "지쳤다" : "보통이다";
        case '노르웨이파랑앵무':
            return (bird.voltage > 100) ? '그을렸다': '예쁘다';
        default:
            return '알수없다';
    }
}

function airSpeedVelocity(bird){ // 비행 속도
    switch(bird.type){
        case '유럽제비':
            return 35;
        case '아프리카제비':
            return 40 - (2 * bird.numberOfCoconuts);
        case '노르웨이파랑앵무':
            return (bird.isNailed) ? 0 : 10 + (bird.voltage / 10);
        default:
            return null;
    }
}