const assert = require('assert');
const {getMin, evenOrOdd, inOrOutRange} = require('../src');

describe('getMin', () => {
    it('should return 5 for given input 5, 9, 7', () => {
        assert.strictEqual(getMin(5, 9, 7), 5);
    });

    it('should return 0 for given input 5, 0, 7', () => {
        assert.strictEqual(getMin(5, 0, 7), 0);
    });

    it('should return -7 for given input 5, 0, -7', () => {
        assert.strictEqual(getMin(5, 0, -7), -7);
    });

});

describe('evenOrOdd', () => {
    it('should check even odd for given input 1, 3, 11', () => {
        assert.strictEqual(evenOrOdd(1, 3, 11), "odd");
    });

    it('should check even odd for given input 2, 4, 8', () => {
        assert.strictEqual(evenOrOdd(2, 4, 8), "even");
    });

    it('should check even odd for given input 2, 5, 8', () => {
        assert.strictEqual(evenOrOdd(2, 5, 8), "even/odd");
    });
});

describe('inOrOutRange', () => {
    it('should return In range for given input 5, 10, 8', () => {
        assert.strictEqual(inOrOutRange(5, 10, 8), "In range");
    });

    it('should return Out of range for given input 0, 6, 11', () => {
        assert.strictEqual(inOrOutRange(0, 6, 11), "Out of range");
    });

    it('should return In range for given input 0, 10, 10', () => {
        assert.strictEqual(inOrOutRange(0, 10, 10), "In range");
    });
});
