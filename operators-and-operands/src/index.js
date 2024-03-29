/**
 *
 * @param number1: {Number}
 * @param nunber2: {Number}
 * @returns {Number}
 */
module.exports.getSum = function getSum(number1, number2) {
    return parseFloat((number1 + number2).toFixed(1));
};

/**
 *
 * @param name: {String}
 * @param surname: {String}
 * @param age: {Number}
 * @returns {String}
 */
 module.exports.greeting = function greeting (name, surname, age)  {
    return `Hi, ${name} ${surname}! You're ${age} years old.`;
};

/**
 *
 * @param x: {Number}
 * @returns {Boolean}
 */
module.exports.isSquare = function isSquare(x) {
    let sqrtNum = Math.sqrt(x);
    return sqrtNum % 1 === 0;
};


