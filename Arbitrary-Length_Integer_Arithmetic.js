// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but I'm coding floats support as an excersize
 */
/*
const {
    add, subtract, multiply, divide
} = (() => {*/
    /**
     * Use base 10^SUM_B_10E for add/sub, instead of individual digits
     * Choose SUM_B_10E so sum/diff of SUM_B_10E-digits < Number.MAX_SAFE_INTEGER
     */
    const SUM_B_10E = 12;
    const SUM_MOD = 10**SUM_B_10E;
    const N_NINES = SUM_MOD - 1; // for the complements
    
    const MUL_BASE_10E = 8;
    
    // UTIL: left pad with 0
    const lp0 = (n, l = SUM_B_10E) => '0'.repeat(l - String(n).length) + n;
    
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
    
    const sme2f = (fObj, targetE = 0) => {
        if (! fObj.s) return '0';
        const sign = (~fObj.s) ? '' : '-';
        const e = fObj.e - targetE;
        if (! e) return sign + fObj.m;
        if (e > 0) return sign + fObj.m + '0'.repeat(e);
        const frac = lp0(fObj.m.slice(e), -e);
        const int = fObj.m.slice(0, e) || '0';
        return `${sign}${int}.${frac}` + (targetE ? `e${targetE}` : '');
    }
    
    // UTIL: Negate the number in its object representation
    const neg = fo => ({...fo, s: fo.s * -1});
    
    // UTIL: 10**SUM_B_10E complement
    const b10ECmpl = digList => {
        let carry = 1;
        return digList.map(e => {
            const cmpl = N_NINES - e + carry;
            carry = Math.floor(cmpl / SUM_MOD);
            return cmpl % SUM_MOD;
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
        // split strings into SUM_B_10E-length chunks, FROM LEFT
        const digLists = strs.map(str => chunk(str, SUM_B_10E));
        // max addition columns {
        const maxDigits = digLists.map(
            e => e.length
        ).reduce(
            (acc, e) => Math.max(acc, e), 0
        ) + Math.round(Math.log10(digLists.length) / SUM_B_10E + 0.5) + 1;
        // +1 - reserve place for complement carry ^^^
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
                sum[i] = ds % SUM_MOD;
                carry = (ds / SUM_MOD)|0;
            });
            
            return sum;
        }, Array(maxDigits).fill(0));
        const carry = resultDL[resultDL.length - 1];
        
        let sign = '';
        if (carry >= SUM_B_10E / 2) {
            resultDL = b10ECmpl(resultDL);
            sign = '-';
        }
        return f2sme(sign +
            resultDL.reverse().map(d => lp0(d)).join('')
        + 'e' + resultExp);
    }
    
    const ops = {
        add: (a, b) => sme2f(sum(f2sme(a), f2sme(b))),
        subtract: (a, b) => sme2f(sum(f2sme(a), neg(f2sme(b)))),
        multiply: (a, b) => {
            
            return 'MUL';
        },
        divide: (a, b, fds = 0) => {
            
            return 'DIV';
        },
    }
    
/*    
    return ops;
})();*/