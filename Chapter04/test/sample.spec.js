import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';
import {expect} from 'chai';

describe('sample.spec.js - Province', function(){
    it('shortfall - using assert', function(){
        const asia = new Province(sampleProvinceData());
        assert.equal(asia.shortfall, 5);
    });
    it('shortfall - using chai', function(){
        const asia = new Province(sampleProvinceData());
        expect(asia.shortfall).equal(5);
    })
});