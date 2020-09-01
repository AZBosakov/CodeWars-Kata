const PRICE = 25;

// Transcation status codes
const TR = 'OK NO_CHANGE INSUFFICIENT FAIL'.split(/\s+/).reduce(
    (acc, e, i) => {
        acc[e] = i;
        return acc;
    }, {}
);

// Carsh Register: { denom1: count1, denom2: count2, ... }
let CR = {};

/**
 * Helper funcs
 * Convert between {d1:n, d2:m, ...} <=> [d1 n-times, d2 m-times, ...]
 * eg, {25:2, 50:1, 100:2} <=> [25, 25, 50, 100, 100]
 */
const cash2arr = cash => Object.entries(cash).map(
    e => Array(e[1]).fill(e[0])
).flat();
const arr2cash = arr => arr.reduce(
    (acc, e) => (acc[e] ? acc[e]++ : (acc[e] = 1), acc), {}
);

/**
 * @param cash { denom1: count1, denom2: count2, ... }
 */
const sumCash = cash => Object.entries(cash).reduce((acc, e) => acc + e[0] * e[1], 0);

/**
 * @param cr the cash register
 * @param cash the money given
 * @return object the updated register
 */
const addCash = (cr, cash) => {
    const ncr = {...cr};
    Object.entries(cash).forEach(([d, c]) => ncr[d] = (ncr[d] || 0) + c)
    return ncr;
}

/**
 * @param cr the cash register
 * @param cash the money given
 * @return object {
 *      cr: register after +cash/-change
 *      change: the change in the CR format
 *      fail: if transcation failed (eg. no change)
 * }
 */
const transcation = (cr, cash) => {
    const totalCashGiven = sumCash(cash);
    const totalChange = totalCashGiven - PRICE;
    if (0 > totalChange) {
        return {cr, change: {}, fail: TR.INSUFFICIENT};
    }
    const ncr = addCash(cr, cash);
    if (0 == totalChange) {
        return {cr: ncr, change: {}, fail: TR.OK };
    }
    
    
    
    return {cr, change: {}, fail: TR.FAIL};
}
