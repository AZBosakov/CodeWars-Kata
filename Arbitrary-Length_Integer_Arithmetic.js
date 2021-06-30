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
    const SUM_B_10E = 1; // 12;
    const SUM_MOD = 10**SUM_B_10E;
    const N_NINES = SUM_MOD - 1; // for the complements
    
    const MUL_BASE_10E = 8;
    
    // UTIL: parse float: '-123.456e-3' => {s: -1, m: 123456, e: -6}
    const f2sie = fStr => {
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
        // max addition columns
        const maxDigits = digLists.map(
            e => e.length
        ).reduce(
            (acc, e) => Math.max(acc, e), 0
        ) + Math.round(Math.log10(digLists.length) + 0.5) + 2;
        // +2 - reserve place for complement carry ^^
        // right 0-pad to equalize lengths
        digLists.forEach(dl => {
            dl.push(...Array(maxDigits - dl.length).fill(0));
        });
        
            console.log('before 10compl', digLists);
            
        const digListCmpl = digLists.map((dl, i) => (~fos[i].s) ? dl : b10ECmpl(dl));
            console.log('after 10compl', digListCmpl);
    }
/*    
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
})();*/