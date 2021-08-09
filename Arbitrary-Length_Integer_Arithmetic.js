// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but I'm coding floats support as an excersize
 */

// const {
//     add, subtract, multiply, divide
// } = (() => {
    /**
     * Use base 10^BASE10E instead of individual digits.
     * 
     * Operations act uppon arrays of digits in BASE.
     * The highes array index is used for sign extension in BASE-complement add/subtract.
     */
    const BASE10E = 1;//6; // x*10^6 * y*10^6 < 15 digits precision of the JS MAX_SAFE_INTEGER
    const BASE = 10**BASE10E;
    const N_NINES = BASE - 1;
    const MAX_POS_CARRY = BASE / 2 - 1; // 4999...
    
    // UTIL: left pad with 0
    const lp0 = n => '0'.repeat(BASE10E - String(n).length) + n;
    
    // UTIL: parse float: '-123.456e-3' => {s: -1, m: 123456, e: -6}
    const f2sme = fStr => {
        const parse = fStr.match(/^\s*([+-]?)(\d+(?:\.\d*)?|\d*\.\d+)(?:e([+-]?\d+))?/i);
        if (! parse) return null;
        const [, int, frac] = parse[2].match(/^(\d*)\.?(\d*)$/);
        const [,m, zs] = (int + frac).match(/^0*(\d+?)(0*)$/);
        return {
            m,
            s: m == '0' ? 0 : (parse[1] + 1)|0,
            e: m == '0' ? 0 : (parse[3]|0) - frac.length + zs.length,
        };
    }
    // UTIL: opposite of f2sme()
    const sme2f = (fObj, targetE = 0) => {
        if (! fObj.s) return '0';
        const sign = (fObj.s < 0) ? '-' : '';
        const e = fObj.e - targetE;
        if (e >= 0) {
            return sign + fObj.m + '0'.repeat(e);
        }
        const frac = lp0(fObj.m.slice(e), -e);
        const int = fObj.m.slice(0, e) || '0';
        return `${sign}${int}.${frac}` + (targetE ? `e${targetE}` : '');
    }
    
    // UTIL: Negate the number in its object representation
    const neg = fo => ({...fo, s: fo.s * -1});
    
    // Most Signifficant Digit
    const msd = dl => dl[dl.length - 1];
    
    // UTIL: split string into digits in BASE10E, from the LEFT
    const split10E = (str, n = BASE10E) => {
        const dl = [];
        let e = 0;
        let chunk = '';
        while (
            chunk = str.slice(e - n, e || undefined)
        ) {
            dl.push(parseFloat('0' + chunk));
            e -= n;
        }
        if (msd(dl)) dl.push(0); // Digit for the sign extension
        return dl;
    }
    
    const join10E = dl => dl.map(lp0).reverse().join('');
    
    const signExtend = (dl, i) => {
        if (i < dl.length) return dl[i];
        return sign = (dl[dl.length - 1] > MAX_POS_CARRY) ? N_NINES : 0;
    }
    
    const adder = ['add', 'sub'].reduce((obj, op, opIdx) => {
        obj[op] = (a, b) => {
            const CMPL = opIdx;
            let carry = opIdx;
            const maxDigits = Math.max(a.length, b.length) + 1;
            const result = [];
            for (let i = 0; i < maxDigits; i++) {
                const ai = signExtend(a, i);
                let bi = signExtend(b, i);
                if (CMPL) bi = N_NINES - bi;
                const si = ai + bi + carry;
                carry = Math.floor(si / BASE);
                result.push(si % BASE);
            }
            
            console.log(op, result);
            
            return result;
        }
        return obj;
    }, {});
    
    const sum = (...fos) => {
        // find min common exponent
        const resultExp = Math.min(...fos.map(fo => fo.e));
        // right pad with 0s, to equalize the exponents
        const strs = fos.map(fo => fo.m + '0'.repeat(fo.e - resultExp));
        // split strings into BASE10E-length chunks, FROM LEFT
        const dls = strs.map(str => split10E(str));
        let resDL = dls.reduce(
            (sum, dl, dli) => (fos[dli].s > 0) ? adder.add(sum, dl) : adder.sub(sum, dl),
            [0]
        );
        let sign = '';
        if (msd(resDL) > MAX_POS_CARRY) {
            resDL = adder.sub([0], resDL);
            sign = '-';
        }
        return f2sme(sign + join10E(resDL) + 'e' + resultExp);
    }
    
    const OPS = {
        add: (a, b) => sme2f(
            sum(f2sme(String(a)), f2sme(String(b)))
        ),
        subtract: (a, b) => sme2f(
            sum(f2sme(String(a)), neg(f2sme(String(b))))
        ),
        multiply: (a, b) => {
            
            return 'MUL';
        },
        divide: (a, b, fds = 0) => {
            
            return 'DIV';
        },
    }
  /*  
    return OPS;
})();*/