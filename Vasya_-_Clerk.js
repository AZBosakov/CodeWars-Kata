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
 *      status: transcation status (eg. TR.NO_CHANGE)
 * }
 */
const transcation = (cr, cash, price) => {
    const totalCashGiven = sumCash(cash);
    const totalChange = totalCashGiven - price;
    if (0 > totalChange) {
        return {cr, change: {}, status: TR.INSUFFICIENT};
    }
    const ncr = addCash(cr, cash);
    if (0 == totalChange) {
        return {cr: ncr, change: {}, status: TR.OK };
    }
    
    
    
    return {cr, change: {}, status: TR.FAIL};
}
