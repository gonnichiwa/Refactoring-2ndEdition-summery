import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js - Province', function(){
    let asia;
    beforeEach(function(){
        asia = new Province(sampleProvinceData());
    });
    it('shortfall - using assert', function(){
        assert.equal(asia.shortfall, 5);
    });
    it('shortfall - using chai', function(){
        expect(asia.shortfall).equal(5);
    });
});