const assert = require("assert");
const { createString, rangeSum1, rangeSum2, seriesSum, countDigits } = require("../src");

describe("createString", () => {
    it('should return "0 5 10 15 20" for given input 0, 20, 5', () => {
        assert.deepStrictEqual(createString(0, 20, 5), "0 5 10 15 20");
    });

    it('should return "0 4 8 12 16 20" for given input 0, 20, 4', () => {
        assert.deepStrictEqual(createString(0, 20, 4), "0 4 8 12 16 20");
    });

    it('should return "0 1 2 3 4 5" for given input 0, 5, 1', () => {
        assert.deepStrictEqual(createString(0, 5, 1), "0 1 2 3 4 5");
    });
});

describe("rangeSum1", () => {
    it("should return 10 for given input 0, 3", () => {
        assert.deepStrictEqual(rangeSum1(0, 3), 10);
    });

    it("should return 20 for given input 1, 4", () => {
        assert.deepStrictEqual(rangeSum1(1, 4), 20);
    });

    it("should return 304 for given input 101, 102", () => {
        assert.deepStrictEqual(rangeSum1(101, 102), 304);
    });
});

describe("rangeSum2", () => {
    it("should return 45 for given input 5, 10", () => {
        assert.strictEqual(rangeSum2(5, 10), 45);
    });

    it("should return 21 for given input 0, 6", () => {
        assert.strictEqual(rangeSum2(0, 6), 21);
    });

    it("should return 1295 for given input 20, 54", () => {
        assert.strictEqual(rangeSum2(20, 54), 1295);
    });

    it("should return 33 for given input 10, 12", () => {
        assert.strictEqual(rangeSum2(10, 12), 33);
    });
});

describe("seriesSum", () => {
    it("should return 1.00 for given input 1", () => {
        assert.strictEqual(seriesSum(1), "1.00");
    });

    it("should return 1.46 for given input 5", () => {
        assert.strictEqual(seriesSum(5), "1.46");
    });

    it("should return 0.00 for given input 0", () => {
        assert.strictEqual(seriesSum(0), "0.00");
    });
});

describe("countDigits", () => {
    it("should return 9 for given input 123456789", () => {
        assert.strictEqual(countDigits(123456789), 9);
    });

    it("should return 6 for given input 111111", () => {
        assert.strictEqual(countDigits(111111), 6);
    });

    it("should return 1 for given input 0", () => {
        assert.strictEqual(countDigits(0), 1);
    });

    it("should return 16 for given input 1010101010101010", () => {
        assert.strictEqual(countDigits(1010101010101010), 16);
    });
});


