## 변수 추출하기

```js
return order.quantity * order.itemPrice -
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
  Math.min(order.quantity * order.itemPrice * 0.1, 100); 
```

```js
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(order.quantity * order.itemPrice * 0.1, 100);
return basePrice - quantityDiscount + shipping;
```

---

### 클래스 안이라면

- before
```js
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {return this._data.quantity;}
    get itemPrice() {return this._data.itemPrice;}

    get price() {
        return this.quantity * this.itemPrice -
        Math.max(0, this.quantity - 500) * this.itemPrice * 0.05 +
        Math.min(this.quantity * this.itemPrice * 0.1, 100);
    }
}
```

- after
```js
class Order {
    constructor(aRecord) {
        this._data = aRecord;
    }

    get quantity() {return this._data.quantity;}
    get itemPrice() {return this._data.itemPrice;}

    get basePrice() {return this.quantity * this.itemPrice;}
    get quantityDiscount() {return Math.max(0, this.quantity - 500) * this.itemPrice * 0.05;}
    get shipping() {return Math.min(this.quantity * this.itemPrice * 0.1, 100)}

    get price() {
        return this.basePrice - this.quantityDiscount + this.shipping;
    }
}
```