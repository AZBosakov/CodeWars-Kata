// https://www.codewars.com/kata/555615a77ebc7c2c8a0000b8

/**
 * More generic algo than the Kata requires,
 * can calculate change with any denomination combos,
 * not just single banknote.
 * The change calculation algo is the heuristics of a human clerk - 
 * trying the combine the change from the bigger denominations first
 */

const PRICE = 25;

/**
 * F***king rounding errors - 1 - 0.9 != 0.1,
 * so round to small number of dec. places,
 * eg. 2 for cents
 */
const DECIMAL_PRECISION = 2;

// Payment status codes
const PAY = Object.freeze(
    'OK NO_CHANGE INSUFFICIENT FAIL'.split(/\s+/).reduce(
        (acc, e, i) => (acc[e] = i, acc), {}
    )
);

// All cash objects are in format: { denom1: count1, denom2: count2, ... }

// Utils {
/**
 * Round 2 Decimal Place
 * 
 * NOTE to self: Use when mul/sub non-int floats
 * 
 * @param float num - the number to be rounded
 * @return float - the number rounded to dec. places
 */
const r2dp = num => +num.toFixed(DECIMAL_PRECISION);

/**
 * Normalize denomination counts
 * 
 * Merges
 * '0100'/'00100'/etc. into '100' or
 * '0.20'/0.2/'00.20' into '0.2'
 */
const normalize = cashObj => Object.entries(cashObj).reduce(
    (acc, [d, c]) => (acc[+d] = (acc[+d] || 0) + c, acc), {}
);

/**
 * Sum the cash object up to, incl., the maxDenom denomination
 * 
 * @param object cash - { denom1: count1, denom2: count2, ... }
 * @param float maxDenom - ignore denominations above this
 * @return float
 */
const sumCash = (cash, maxDenom = Number.MAX_SAFE_INTEGER) => Object.entries(cash).reduce(
    (acc, [d, c]) => r2dp(acc + (d > maxDenom ? 0 : d * c)), 0
);
// } Utils

/**
 * Can subtract too, but not bellow 0 count of a given denom.
 * 
 * @param object cr - the cash register
 * @param object cash - the money given
 * @return object - the merged register+cash
 */
const addCash = (cr, cash) => Object.entries(cash).reduce(
    (acc, [d, c]) => {
        acc[+d] = (acc[+d] || 0) + c;
        if (acc[d] < 0) throw new Error(`Negative value in Cash register, denom.: ${d}, count added: ${c}`);
        return acc;
    }, normalize(cr)
);

/**
 * @param object cr - the cash register
 * @param object cash - the money given
 * @param float price - the requested price
 * @return object {
 *      cr: {...} - register after +cash/-change
 *      change: {...} - the change in the CR format
 *      status: int - payment status (eg. PAY.NO_CHANGE)
 * }
 */
const pay = (cr, cash, price) => {
    cr = normalize(cr);
    cash = normalize(cash);
    const totalCashGiven = sumCash(cash);
    const totalChange = r2dp(totalCashGiven - price);
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
    const changeEntries = __combineDenoms(
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
 * @return array|false - combination of denominations | failure
 */
const __combineDenoms = (denoms, target) => {
    target = r2dp(target);
    const [d_c, ...smaller] = denoms;
    const denom = d_c[0];
    let count = Math.min(d_c[1], Math.floor(target / denom));
    
    if (r2dp(denom * count) == target) return [[denom, count]];
    if (! smaller.length) return false;
    
    for (count; count >= 0; count--) {
        let entries = __combineDenoms(smaller, target - denom * count);
        if (entries) return count ? [[denom, count], ...entries] : entries;
    }
    
    return false;
}

// Kata Test function
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
// Q&D - no checks, etc.
if (! Object.fromEntries) {
    Object.fromEntries = function(es) {
        return es.reduce((acc, [p, v]) => (acc[p] = v, acc), {});
    }
}