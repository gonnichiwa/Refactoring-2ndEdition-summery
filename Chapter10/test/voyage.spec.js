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
        console.log('---resultB---');
        const resultB = sample.rating(voyageB, historyB);
        // then
        expect(resultA).equal("A");
        expect(resultB).equal("B");
    });
});