// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but coding floats support as an excersize
 */

const {
    add, subtract, multiply, divide
} = (() => {
    /**
     * Use base 10^15 for add/sub, instead of individual digits
     * Sum/diff of 2 15-digits < Number.MAX_SAFE_INTEGER
     */
    const SUM_BASE = 15;
    
    // UTIL: parse float: '-123.456e-3' => {s: -1, i: 123456, e: -6}
    const f2sie = fStr => {
        const parse = fStr.match(/^\s*([+-]?)(\d+(?:\.\d*)?|\d*\.\d+)(?:e([+-]?\d+))?/i);
        if (! parse) return {s: NaN, i: NaN, e: NaN};
        const [, int, frac] = parse[2].match(/^(\d*)\.?(\d*)$/);
        const [,i, zs] = (int + frac).match(/^0*(\d+?)(0*)$/);
        return {
            i,
            s: i == '0' ? 0 : (parse[1] + 1)|0,
            e: i == '0' ? 0 : (parse[3]|0) - frac.length + zs.length,
        };
    }
    
    
    
    return {
        add: (a, b) => {
            
            return result;
        },
        subtract: (a, b) => {
            
            return result;
        },
        multiply: (a, b) => {
            
            return result;
        },
        divide: (a, b, fds = 0) => {
            
            return result;
        },
    }
})();