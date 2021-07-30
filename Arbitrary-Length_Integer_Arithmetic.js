// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but I'm coding floats support as an excersize
 */

// const {
//     add, subtract, multiply, divide
// } = (() => {
    /**
     * Use base 10^BASE10E instead of individual digits
     */
    const BASE10E = 6; // x*10^6 * y*10^6 < 15 digits precision of the JS MAX_SAFE_INTEGER
    const BASE = 10**BASE10E;
    const N_NINES = BASE - 1; // Using BASE complement addition for subtraction
    
    // UTIL: left pad with 0
    const lp0 = (n, l = BASE10E) => '0'.repeat(l - String(n).length) + n;
    
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
    
    // UTIL: 10**BASE10E complement
    const b10ECmpl = digList => {
        let carry = 1;
        return digList.map(e => {
            const cmpl = N_NINES - e + carry;
            carry = Math.floor(cmpl / BASE);
            return cmpl % BASE;
        });
    }
    
    // UTIL: split string into groups of digits, from the LEFT
    const chunk = (str, n = 1) => {
        const dl = [];
        let e = 0;
        let chunk = '';
        while (
            chunk = str.slice(e - n, e || undefined)
        ) {
            dl.push(parseFloat('0' + chunk));
            e -= n;
        }
        return dl;
    }
    
    const sum = (...fos) => {
        // find min common exponent
        const resultExp = Math.min(...fos.map(fo => fo.e));
        // right pad with 0s, to equalize the exponents
        const strs = fos.map(fo => fo.m + '0'.repeat(fo.e - resultExp));
        // split strings into BASE10E-length chunks, FROM LEFT
        const digLists = strs.map(str => chunk(str, BASE10E));
        // max addition columns {
        const maxDigits = digLists.map(
            e => e.length
        ).reduce(
            (acc, e) => Math.max(acc, e), 0
        ) + Math.ceil(Math.log10(digLists.length) / BASE10E) + 1;
        // +1 - reserve place for complement carry >>>^^^
        // } max addition columns
        // right 0-pad to equalize lengths
        digLists.forEach(dl => {
            dl.push(...Array(maxDigits - dl.length).fill(0));
        });
        let resultDL = digLists.reduce((sum, dl, dli) => {
            if (fos[dli].s < 0) dl = b10ECmpl(dl);
            let carry = 0;
            dl.forEach((d, i) => {
                const ds = d + sum[i] + carry;
                sum[i] = ds % BASE;
                carry = (ds / BASE)|0;
            });
            
            return sum;
        }, Array(maxDigits).fill(0));
        const carry = resultDL[resultDL.length - 1];
        
        let sign = '';
        if (carry >= BASE10E / 2) {
            resultDL = b10ECmpl(resultDL);
            sign = '-';
        }
        return f2sme(sign +
            resultDL.reverse().map(d => lp0(d)).join('')
        + 'e' + resultExp);
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