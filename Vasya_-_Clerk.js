const PRICE = 25;

// Transcation status codes
const TR = 'OK NO_CHANGE INSUFFICIENT FAIL'.split(/\s+/).reduce(
    (acc, e, i) => (acc[e] = i, acc), {}
);

// Carsh Register: { denom1: count1, denom2: count2, ... }
let CR = {};

/**
 * Sum the cash object up, incl., to the maxDenom denomation
 * 
 * @param object cash { denom1: count1, denom2: count2, ... }
 * @param float maxDenom ignore denominations above this
 * @return float
 */
const sumCash = (cash, maxDenom = Number.MAX_SAFE_INTEGER) => Object.entries(cash).reduce(
    (acc, e) => acc + (e[0] > maxDenom ? 0 : e[0] * e[1]), 0
);

/**
 * @param object cr - the cash register
 * @param object cash - the money given
 * @return object - the updated register
 */
const addCash = (cr, cash) => Object.entries(cash).reduce(
    (acc, [d, c]) => {
        acc[+d] = (acc[+d] || 0) + c;
        if (acc[d] < 0) throw new Error(`Negative value in Cash register, denom.: ${d}, count added: ${c}`);
        return acc;
    }, {...cr}
);

/**
 * @param object cr - the cash register
 * @param object cash - the money given
 * @param float price - the requested price
 * @return object {
 *      cr: register after +cash/-change
 *      change: the change in the CR format
 *      status: transcation status (eg. TR.NO_CHANGE)
 * }
 */
const transcation = (cr, cash, price) => {
    const totalCashGiven = sumCash(cash);
    const totalChange = totalCashGiven - price;
    if (0 > totalChange) { // Too few money given
        return {cr, change: cash, status: TR.INSUFFICIENT};
    }
    const ncr = addCash(cr, cash);
    if (0 == totalChange) { // Exact price given
        return {cr: ncr, change: {}, status: TR.OK };
    }
    if (sumCash(ncr, totalChange) < totalChange) { // Not enough money in smaller denoms.
        return {cr, change: cash, status: TR.NO_CHANGE};
    }
    // Try to combine the different denominations in the cr to match the change
    const changeEntries = _tryComb(
        Object.entries(ncr).filter(e => e[0] <= totalChange).sort(([a], [b]) => b - a);
        totalChange
    );
    if (! changeEntries) {
        return {cr, change: cash, status: TR.NO_CHANGE};
    }
    
    
    return {cr, change: cash, status: TR.FAIL};
}

/**
 * @param array denoms - Object.entries of the cr with denom up to target, sorted descending
 * @param float target
 * @return object|false - combination of denominations | failure
 */
const _tryComb = (denoms, target) => {
    const [d_c, ...smaller] = denoms;
    const denom = d_c[0];
    const count = Math.min(d_c[1], Math.floor(target / denom));
    if (denom * count == target) return [denom, count];
    
    
    return false;
}
