const assert = require('assert');
const {getSum, greeting, isSquare} = require('../src');

describe('getSum', () => {
    it('should return 5 for given input 2, 3', () => {
        assert.deepStrictEqual(getSum(2, 3), 5);
    });

    it('should return -8 for given input -11, 3', () => {
        assert.deepStrictEqual(getSum(-11, 3), -8);
    });

    it('should return 0.9 for given input 0.2, 0.7', () => {
        assert.deepStrictEqual(getSum(0.2, 0.7), 0.9);
    });
});

describe('greeting', () => {
    it('should prepare string for given input "Bill", "Jacobson", 33', () => {
      assert.strictEqual(greeting('Bill', 'Jacobson', 33), 'Hello, my name is Bill Jacobson and I am 33 years old.');
    });
  
    it('should prepare string for given input "Jim", "Power", 11', () => {
      assert.strictEqual(greeting('Jim', 'Power', 11), 'Hello, my name is Jim Power and I am 11 years old.');
    });
  });

describe('isSquare', () => {
     it('should return true for given input 9', () => {
        assert.strictEqual(isSquare(9), true);
    });

    it('should return false for given input 8', () => {
        assert.strictEqual(isSquare(8), false);
    });

    it('should return true for given input 1', () => {
        assert.strictEqual(isSquare(1), true);
    });
});

