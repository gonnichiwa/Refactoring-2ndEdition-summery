import * as sample from '../source/chapter10-4.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js', function() {
    let data;
    beforeEach(function() {
        // given
        data = [
            { name: 'jebiname', type: '유럽제비' },
            { name: 'africajebiname', type: '아프리카제비', numberOfCoconuts: 4, },
            { name: 'norwayparangname',
              type: '노르웨이파랑앵무',
              voltage: 200 },
            { name: 'norwayparangname22', 
              type: '노르웨이파랑앵무',
              voltage: 50,
              isNailed: false },
            { name: 'chambird', type: '참새' }
        ];
    });
    it('plumages count', function() {
        // when
        const plumages = sample.plumages(data);
        // then
        expect(plumages.size).equal(data.length);
    });
    it('plumages name and value check', function() {
        // when
        const plumages = sample.plumages(data);
        // then
        expect(plumages.get('africajebiname')).equal('지쳤다');
        expect(plumages.get('norwayparangname')).equal('그을렸다');
    });
    it('speeds', function() {
        // when
        const bSpeeds = sample.speeds(data);
        // then
        expect(bSpeeds.get('africajebiname')).equal(32);
        expect(bSpeeds.get('norwayparangname22')).equal(15);
        expect(bSpeeds.get('chambird')).equal(null);
    });
});