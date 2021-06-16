// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but coding floats support as an excersize
 */

const {
    add, subtract, multiply, divide
} = (() => {
    // Use base 10^12 for add/sub, instead of individual digits
    const ADD_BASE = 12;
    
    // '-123.456e-3' => {s: -1, i: 123456, e: -6}
    const f2sie = fStr => {
        const parse = fStr.match(/^\s*([+-]?)(\d+(?:\.\d*)?|\d*\.\d+)(?:e([+-]?\d+))?/i);
        if (! parse) return {s: NaN, i: NaN, e: NaN};
        const [, int, frac] = parse[2].match(/^(\d*)\.?(\d*)$/);
        return {
            s: (parse[1] + 1)|0,
            i: int + frac,
            e: (parse[3]|0) - frac.length,
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