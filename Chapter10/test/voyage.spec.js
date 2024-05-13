import * as sample from '../source/voyage.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('voyage.js', function() {
    let voyageA;
    let historyA;
    let voyageB;
    let historyB;
    beforeEach(function() {
        // given (rating : A)
        voyageA = {zone: "중국", length: 3};
        historyA = [
            {zone: "동인도", profit: 5},
            {zone: "중국", profit: 20},
            {zone: "일본", profit: -2},
            {zone: "서아프리카", profit: 7}
        ]
        // given (rating : B)
        voyageB = {zone: "서인도", length: 10};
        historyB = [
            {zone: "동인도", profit: 5},
            {zone: "서인도", profit: 15},
            {zone: "중국", profit: -2},
            {zone: "서아프리카", profit: 7}
        ];
    });
    it('rating result', function() {
        // when
        console.log('---resultA---');
        const resultA = sample.rating(voyageA, historyA);
        console.log('vpf:', resultA.voyageProfitFactor);
        console.log('vr:', resultA.voyageRisk);
        console.log('chr:', resultA.captainHistoryRisk);
        
        console.log('---resultB---');
        const resultB = sample.rating(voyageB, historyB);
        console.log('vpf:', resultB.voyageProfitFactor);
        console.log('vr:', resultB.voyageRisk);
        console.log('chr:', resultB.captainHistoryRisk);

        // then
        expect(resultA.value).equal("A");
        expect(resultB.value).equal("B");
        // ---resultA---
        // vpf: 6
        // vr: 5
        // chr: 4
        // ---resultB---
        // vpf: 2
        // vr: 5
        // chr: 6
    });
});