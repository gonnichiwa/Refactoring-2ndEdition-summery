import * as sample from '../source/voyage.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('voyage.js', function() {
    let voyage1;
    let history1;
    beforeEach(function() {
        // given
        voyage1 = {zone: "서인도", length: 10};
        history1 = [
            {zone: "동인도", profit: 5},
            {zone: "서인도", profit: 15},
            {zone: "중국", profit: -2},
            {zone: "서아프리카", profit: 7}
        ];
    });
    it('rating result', function() {
        // when
        const result = sample.rating(voyage1, history1);
        // then
        expect(result).equal("B");
    });
});