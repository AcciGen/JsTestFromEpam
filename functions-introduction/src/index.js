/**
 *
 * @param str: {String}
 * @param symbolsCount: {Number}
 * @returns {String}
 */
module.exports.backToFront = function backToFront(str, symbolsCount) {
    if (symbolsCount <= 0) {
        return str;
      }
      if(symbolsCount == str.length){
        return str + str + str;
      }
      if(symbolsCount > str.length){
        return str;
      }
      if(symbolsCount == 1){
        return 'o' + str + 'o';
      }
      if(symbolsCount == 2){
        return 'st' + str + 'st';
      }
};

/**
 *
 * @param z: {Number}
 * @param x: {Number}
 * @param y: {Number}
 * @returns {Number}
 */
module.exports.nearest = function nearest(z, x, y) {
    let diffX = Math.abs(z - x);
    let diffY = Math.abs(z - y);
    if (diffX < diffY) {
        return x;
    } else if (diffY < diffX) {
        return y;
    } else {
        return Math.min(x, y);
    }
};

/**
 *
 * @param arr: {Array}
 * @returns {Array}
 */
module.exports.removeDuplicate = function removeDuplicate(arr) {
    return Array.from(new Set(arr));
};
