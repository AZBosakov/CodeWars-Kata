// https://www.codewars.com/kata/526571aae218b8ee490006f4

var countBits = function(n) {
    // https://en.wikipedia.org/wiki/Hamming_weight
    let popCount;
    for (popCount = 0; n; popCount++) {
        n &= n - 1;
    }
    return popCount;
};