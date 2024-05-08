import { sampleProvinceData, Province, Producer } from '../source/sample.js';
import assert from 'assert';

describe('sample.spec.js', function(){
    it('shortfall', function(){
        const asia = new Province(sampleProvinceData());
        assert.equal(asia.shortfall, 5);
    });
});