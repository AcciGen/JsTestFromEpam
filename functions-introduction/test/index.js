const assert = require('assert');
const {backToFront, nearest, removeDuplicate} = require('../src');

describe('backToFront', () => {
    it('should return asdasdasd for given input (asd, 3)', () => {
        assert.strictEqual(backToFront('asd', 3), 'asdasdasd');
    });

    it('should return ohelloo for given input (hello, 1)', () => {
        assert.strictEqual(backToFront('hello', 1), 'ohelloo');
    });

    it('should return sttestst for given input (test, 2)', () => {
        assert.strictEqual(backToFront('test', 2), 'sttestst');
    });

    it('should return world for given input (world, 5)', () => {
        assert.strictEqual(backToFront('world', 5), 'worldworldworld');
    });

    it('should return test for given input (test, 100)', () => {
        assert.strictEqual(backToFront('test', 100), 'test');
    });
});

describe('nearest', () => {
    it('should return 10 for given input (20, 10, 50)', () => {
        assert.strictEqual(nearest(20, 10, 50), 10);
    });

    it('should return 50 for given input (100, 200, 50)', () => {
        assert.strictEqual(nearest(100, 200, 50), 50);
    });

    it('should return 40 for given input (44, 40, 60)', () => {
        assert.strictEqual(nearest(44, 40, 60), 40);
    });

    it('should return 100 for given input (100, 100, 101)', () => {
        assert.strictEqual(nearest(100, 100, 101), 100);
    });
});

describe('removeDuplicate', () => {
    it('should return [1,2,3] for given input [1,1,1,2,3,3]', () => {
        assert.deepStrictEqual(removeDuplicate([1, 1, 1, 2, 3, 3]), [1, 2, 3]);
    });

    it('should return ["a", "b"] for given input ["a", "b", "b", "b"]', () => {
        assert.deepStrictEqual(removeDuplicate(["a", "b", "b", "b"]), ["a", "b"]);
    });

    it('should return [44, "a", 11] for given input [44, "a", 11, 44, "a", 11, 44, "a", 11]', () => {
        assert.deepStrictEqual(removeDuplicate([44, "a", 11, 44, "a", 11, 44, "a", 11]), [44, "a", 11]);
    });
});
