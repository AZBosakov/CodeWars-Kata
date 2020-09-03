/**
 * More generic algo than the Kata requires, works with any denominations.
 */
const PRICE = 25;

// Payment status codes
const PAY = 'OK NO_CHANGE INSUFFICIENT FAIL'.split(/\s+/).reduce(
    (acc, e, i) => (acc[e] = i, acc), {}
);

// All cash objects are in format: { denom1: count1, denom2: count2, ... }

/**
 * Sum the cash object up to, incl., the maxDenom denomination
 * 
 * @param object cash - { denom1: count1, denom2: count2, ... }
 * @param float maxDenom - ignore denominations above this
 * @return float
 */
const sumCash = (cash, maxDenom = Number.MAX_SAFE_INTEGER) => Object.entries(cash).reduce(
    (acc, [d, c]) => acc + (d > maxDenom ? 0 : d * c), 0
);

/**
 * Can subtract too, but not bellow 0
 * 
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
 *      status: payment status (eg. PAY.NO_CHANGE)
 * }
 */
const pay = (cr, cash, price) => {
    const totalCashGiven = sumCash(cash);
    const totalChange = totalCashGiven - price;
    if (0 > totalChange) { // Too few money given
        return {cr, change: cash, status: PAY.INSUFFICIENT};
    }
    // CR Before Change
    const cr_bc = addCash(cr, cash);
    if (0 == totalChange) { // Exact price given
        return {cr: cr_bc, change: {}, status: PAY.OK };
    }
    if (sumCash(cr_bc, totalChange) < totalChange) { // Not enough money in smaller denoms.
        return {cr, change: cash, status: PAY.NO_CHANGE};
    }
    // Try to combine the different denominations in the cr to match the change
    const changeEntries = _combineDenoms(
        Object.entries(cr_bc).filter(e => e[0] <= totalChange).sort(([a], [b]) => b - a),
        totalChange
    );
    if (! changeEntries) {
        return {cr, change: cash, status: PAY.NO_CHANGE};
    }
    return {
        cr: addCash(
            cr_bc,
            Object.fromEntries(changeEntries.map(([d, c]) => [d, -c])) // Invert count to subtract
        ),
        change: Object.fromEntries(changeEntries),
        status: PAY.OK
    };
}

/**
 * Recursively combine progressively smaller denominations
 * 
 * @param array denoms - Object.entries of the cr with denom. up to target, sorted descending!
 * @param float target
 * @return object|false - combination of denominations | failure
 */
const _combineDenoms = (denoms, target) => {
    const [d_c, ...smaller] = denoms;
    const denom = d_c[0];
    let count = Math.min(d_c[1], Math.floor(target / denom));
    
    if (denom * count == target) return [[denom, count]];
    if (! smaller.length) return false;
    
    for (count; count >= 0; count--) {
        let newTarget = target - denom * count;
        let entries = _combineDenoms(smaller, newTarget);
        if (entries) return count ? [[denom, count], ...entries] : entries;
    }
    
    return false;
}

// Test function
const tickets = peopleInLine => {
    // the cash register
    let cr = {};
    for (let bNote of peopleInLine) {
        const payment = pay(cr, {[+bNote]: 1}, PRICE);
        if (payment.status != PAY.OK) return 'NO';
        cr = payment.cr;
    }
    return 'YES';
}

// Apparently CodeWars needs a polyfill...
// QnD - no checks, etc.
if (! Object.fromEntries) {
    Object.fromEntries = function(es) {
        return es.reduce((acc, [p, v]) => (acc[p] = v, acc), {});
    }
}