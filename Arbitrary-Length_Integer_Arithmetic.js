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
     * The [SED] prop is used for sign extension in BASE-complement add/subtract.
     */
    const BASE10E = 1;//6; // x*10^6 * y*10^6 < 15 digits precision of the JS MAX_SAFE_INTEGER
    const BASE = 10**BASE10E;
    const N_NINES = BASE - 1;
    
    const SED = Symbol.for('sign_extension_digit');
    
    const PF = (() => {
        const DP = '.';
        
        const methods = {
            negate() {
                return Object.freeze(
                    Object.assign(
                        Object.create(methods), this, {sign: this.sign * -1}
                    )
                );
            },
            toString(targetE = 0) {
                if (! this.sign) return '0';
                const s = this.sign < 0 ? '-' : '';
                const e = targetE ? 'e' + targetE : '';
                const lShift = this.exp - targetE;
                let d = '';
                if (lShift >= 0) {
                    d = this.digits + '0'.repeat(lShift);
                } else {
                    d = this.digits.slice(0, lShift) || '0';
                    const frac = this.digits.slice(lShift);
                    d += DP + '0'.repeat(-(lShift + frac.length)) + frac;
                }
                return s + d + e;
            },
        }
        
        return numStr => {
            numStr += '';
            const parse = numStr.match(/^\s*([+-]?)(\d+(?:\.\d*)?|\d*\.\d+)(?:e([+-]?\d+))?/i);
            if (! parse) {
                throw new TypeError(`Arg. must be a parseFloat()-style string, ${numStr} passed`);
            }
            const [i, f] = (parse[2] + DP).split(DP, 2);
            const [, digits, r0s] = (i + f).match(/^0*(\d+?)(0*)$/);
            const obj = Object.create(methods);
            if (digits == '0') {
                Object.assign(obj, {digits, sign: 0, exp: 0});
            } else {
                Object.assign(obj, {
                    digits,
                    sign: (parse[1] == '-') ? -1 : 1,
                    exp: (parse[3] || 0) - f.length + r0s.length
                });
            }
            return Object.freeze(obj);
        }
    })();
        
    // UTIL: left pad with 0
    const lp0 = n => '0'.repeat(BASE10E - String(n).length) + n;
    
    // UTIL: split string into digits in BASE10E, from the LEFT
    const split10E = str => {
        const dl = [];
        let e = 0;
        let chunk = '';
        while (
            chunk = str.slice(e - BASE10E, e || undefined)
        ) {
            dl.push(parseFloat('0' + chunk));
            e -= BASE10E;
        }
        dl[SED] = 0;
        return dl;
    }
    
    const join10E = dl => dl.map(lp0).reverse().join('');
    
    const signExtend = (dl, i) => (i < dl.length) ? dl[i] : (dl[SED] || 0);
    
    /**
     * Remove the most signifficant sign digits, equal to [SED]
     * Does not create new array - modifies the passed one
     */
    const trim = dl => {
        dl[SED] = dl[SED] || 0;
        let i = dl.length;
        while (--i && dl[i] == dl[SED]) ;
        dl.length = i+1;
        return dl;
    }
    
    /**
     * create two separate adders, to avoid creating additional
     * BASE complement array for subtraction
     * 'add' does direct carry addition, 'sub' first does a BASE complement.
     * 
     * The sign extension digit is stored in [SED] prop of the array.
     */
    const adder = ['add', 'sub'].reduce((obj, op, opIdx) => {
        obj[op] = (a, b) => {
            const CMPL = opIdx; // BASE complement needed?
            let carry = opIdx; // 0 || 1
            const maxDigits = Math.max(a.length, b.length) + 2; // +2 for carry + SED
            const result = [];
            for (let i = 0; i < maxDigits; i++) {
                const ai = signExtend(a, i);
                let bi = signExtend(b, i);
                if (CMPL) bi = N_NINES - bi;
                const si = ai + bi + carry;
                carry = Math.floor(si / BASE);
                result.push(si % BASE);
            }
            result[SED] = result[result.length - 1];
            return trim(result);
        }
        return obj;
    }, {});
    
    const digitList = {
        is0: dl => !(dl[SED] || ~dl.findIndex(d => d)),
        /**
         * return the power of BASE for digit lists 1,0,0...
         * or -1 if not a power of BASE
         */
        powerOfBase: dl => {
            if (dl[SED]) return false;
            let enc = false;
            let power = -1;
            dl.some((d, i) => {
                if (!d) return false;
                if (enc || d > 1) {
                    power = -1;
                    return true;
                }
                enc = true;
                power = i;
                return false;
                
            });
            return power;
        },
        leftShift: (dl, n) => { //TODO
            
        },
    }
    
    const sum = (...fos) => {
        // find min common exponent
        const resultExp = Math.min(...fos.map(fo => fo.exp));
        // right pad with 0s, to equalize the exponents
        const strs = fos.map(fo => fo.digits + '0'.repeat(fo.exp - resultExp));
        let resDL = strs.map(str => split10E(str)).reduce(
            (sum, dl, dli) => (fos[dli].sign > 0) ? adder.add(sum, dl) : adder.sub(sum, dl),
            [0]
        );
        let sign = '';
        if (resDL[SED]) {
            resDL = adder.sub([0], resDL);
            sign = '-';
        }
        return PF(sign + join10E(resDL) + 'e' + resultExp);
    }
    
    const mul = (a, b) => {
        
    }
    
    const OPS = {
        add: (a, b) => sum(PF(a), PF(b)) + '',
        subtract: (a, b) => sum(PF(a), PF(b).negate()) + '',
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