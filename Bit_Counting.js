var countBits = function(n) {
    // https://en.wikipedia.org/wiki/Hamming_weight
    let popCount;
    for (popCount = 0; n; popCount++) {
        n &= n - 1;
    }
    return popCount;
};