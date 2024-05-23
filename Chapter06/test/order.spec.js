import Order from '../source/order.js';
// import assert from 'assert';
import {expect} from 'chai';

describe('order.js', function() {
    let order;
    beforeEach(function() {
        // given (rating : A)
        order = [
            {
                quantity : 3,
                itemPrice : 1000,
                itemName : '1000'
            },
            {
                quantity : 2,
                itemPrice : 2300,
                itemName : '2300'
            }
        ];
    });
    it('Order result', function() {
        // when
        const priceList = order.map((aOrder) => new Order(aOrder).price );

        // then
        expect(priceList[0]).equal(3100);
        expect(priceList[1]).equal(4700);
    });
});