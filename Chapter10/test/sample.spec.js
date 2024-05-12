import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';

describe('sample.spec.js - Province', function(){
    let asia;
    beforeEach(function(){
        asia = new Province(sampleProvinceData());
    });
    it('Chapter10 test', function(){
        assert.equal(asia.shortfall, 5);
    });
});