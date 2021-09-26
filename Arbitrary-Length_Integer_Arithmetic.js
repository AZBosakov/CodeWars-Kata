// https://www.codewars.com/kata/530e69ae72d6dfced0000a9e

/**
 * The kata requires only positive ints,
 * but I'm coding floats support as an excersize
 */

const {
    add, subtract, multiply, divide
} = (() => {
    /**
     * Use base 10^LOG_BASE instead of individual digits.
     * 
     * Operations act uppon arrays of digits in BASE.
     * The [SED] prop is used for sign extension in BASE-complement add/subtract.
     */
    const LOG_BASE = 6;//1;//6; // x*10^6 * y*10^6 < 15 digits precision of the JS MAX_SAFE_INTEGER
    const BASE = 10**LOG_BASE;
    const N_NINES = BASE - 1;
    
    const SED = Symbol.for('sign_extension_digit');
    
    const PF = (() => {
        const DP = '.';
        
        const methods = Object.freeze({
            negate() {
                return Object.freeze(
                    Object.assign(
                        Object.create(methods), this, {sign: -this.sign}
                    )
                );
            },
            shift(sh = 0) {
                if (! this.sign) return this;
                sh = Math.round(sh);
                return Object.freeze(
                    Object.assign(
                        Object.create(methods), this, {exp: this.exp + sh}
                    )
                );
            },
            withSign(s) {
                if (this.sign && !s) throw new RangeError("Can't set sign 0 on non-zero num");
                return Object.freeze(
                    Object.assign(
                        Object.create(methods), this, {sign: this.sign ? Math.sign(s) : 0}
                    )
                );
            },
            truncate(decPl = 0) {
                decPl = Math.min(-this.exp, decPl);
                const trunc = this.digits.slice(0, (this.exp + decPl) || undefined) || '0';
                const isZero = trunc == '0';
                return Object.freeze(
                    Object.assign(
                        Object.create(methods), this, {
                            digits: trunc,
                            exp: isZero ? 0 : -decPl,
                            sign: isZero ? 0 : this.sign
                        }
                    )
                );
            },
            toString(targetE = 0) {
                targetE = Math.round(targetE);
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
        });
        
        return numStr => {
            numStr += '';
            const parse = numStr.match(/^\s*([+-]?)(\d+(?:\.\d*)?|\d*\.\d+)(?:e([+-]?\d+))?/i); //TODO - DP
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
    
    const OP = {}; // NS for the operations
    const ALGO = {}; // NS for the algorithms
    
    // NS for DigitList functions {
    const DL = {
        // split string into digits in LOG_BASE, from the LEFT
        fromString: digits => {
            const dl = [];
            let e = 0;
            let chunk = '';
            while (
                chunk = digits.slice(e - LOG_BASE, e || undefined)
            ) {
                dl.push(parseFloat('0' + chunk));
                e -= LOG_BASE;
            }
            dl[SED] = 0;
            return dl;
        },
        stringify: dl => dl.map(n => '0'.repeat(LOG_BASE - (n+'').length) + n).reverse().join(''),
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
        shift: (dl, n) => {
            if (! n) return dl;
            let ndl;
            if (n < 0) {
                if (-n > dl.length) return [0];
                ndl = dl.slice(-n);
            } else {
                ndl = [...Array(n).fill(0), ...dl];
            }
            ndl[SED] = dl[SED] || 0;
            return ndl;
        },
        // for i > dl.length return the sign extension; for negative i return 0
        get: (dl, i) => {
            if (!dl[SED]) dl[SED] = 0;
            if (i >= dl.length) return dl[SED];
            if (i < 0) return 0;
            return dl[i];
        },
        /**
        * Remove the most signifficant digits, equal to [SED]
        * Does not create new array - modifies the passed one
        */
        trim: dl => {
            dl[SED] = dl[SED] || 0;
            let i = dl.length;
            while (--i && dl[i] == dl[SED]) ;
            dl.length = i+1;
            return dl;
        },
        cmp(dla, dlb) {
            this.trim(dla);
            this.trim(dlb);
            let sedDiff = dlb[SED] - dla[SED];
            if (sedDiff) return Math.sign(sedDiff);
            let lenDiff = dla.length - dlb.length;
            let isNeg = dla[SED] ? -1 : 1;
            if (lenDiff) return Math.sign(lenDiff * isNeg);
            let i = dla.length;
            while(i--) {
                const d = dla[i] - dlb[i];
                if (d) return Math.sign(d);
            }
            return 0;
        },
    };
    
    /**
     * create two separate adders, to avoid creating additional
     * BASE complement array for subtraction
     * '.add' does direct carry addition, '.sub' first does a BASE complement.
     * 
     * The sign extension digit is stored in [SED] prop of the array.
     */
    ['add', 'sub'].forEach((op, opIdx) => {
        DL[op] = function (a, b) {
            const CMPL = opIdx; // BASE complement needed?
            let carry = opIdx; // 0 || 1
            const maxDigits = Math.max(a.length, b.length) + 2; // +2 for carry + SED
            const result = [];
            for (let i = 0; i < maxDigits; i++) {
                const ai = this.get(a, i);
                let bi = this.get(b, i);
                if (CMPL) bi = N_NINES - bi;
                const si = ai + bi + carry;
                carry = Math.floor(si / BASE);
                result.push(si % BASE);
            }
            result[SED] = result[result.length - 1];
            return this.trim(result);
        }
    });
    
    DL.abs = function(dl) {
        return dl[SED] ? this.sub([0], dl) : this.trim(dl);
    }
    
    OP.sum = (...pfs) => {
        // find min common exponent
        const resultExp = Math.min(...pfs.map(pf => pf.exp));
        // right pad with 0s, to equalize the exponents
        const strs = pfs.map(pf => pf.digits + '0'.repeat(pf.exp - resultExp));
        let resultDL = strs.map(str => DL.fromString(str)).reduce(
            (sum, dl, dli) => (pfs[dli].sign > 0) ? DL.add(sum, dl) : DL.sub(sum, dl),
            [0]
        );
        const s = resultDL[SED] ? -1 : 1;
        return PF( DL.stringify( DL.abs(resultDL) ) ).shift(resultExp).withSign(s);
    }
    
    // googled it, translated from the python example
    // Works on absolute values
    ALGO.karatsuba = function (dla, dlb) {
        dla = DL.abs(dla);
        dlb = DL.abs(dlb);
        // handle [], [0], [0,0,...]
        if (DL.is0(dla) || DL.is0(dlb)) return [0];
        let pob;
        // handle [1], [0,1], [0,0,1], ...
        if (~(pob = DL.powerOfBase(dla))) return DL.shift(dlb, pob);
        if (~(pob = DL.powerOfBase(dlb))) return DL.shift(dla, pob);
        
        const dc = Math.max(dla.length, dlb.length);
        if (dc == 1) {
            const p = dla[0] * dlb[0];
            const l = p % BASE;
            const h = Math.floor(p / BASE);
            const res = [l];
            if (h) res.push(h);
            return res;
        }
        
        const n = Math.ceil(dc / 2);
        
        const a = dla.slice(n);
        const b = dla.slice(0, n);
        const c = dlb.slice(n);
        const d = dlb.slice(0, n);
        
        const ac = this.karatsuba(a, c);
        const bd = this.karatsuba(b, d);
        
        const a$b = DL.add(a, b);
        const c$d = DL.add(c, d);
        
        let t = this.karatsuba(a$b, c$d);
        
		const ad$bc = DL.sub(DL.sub(t, ac), bd);
        
        const h = DL.shift(ac, n*2);
        const m = DL.shift(ad$bc, n);
        
        return DL.add(DL.add(h, m), bd);
    }
    
    DL.mul = function (dla, dlb) {
        const isNeg = (!dla[SED] != !dlb[SED]);
        let resultDL = ALGO.karatsuba(this.abs(dla), this.abs(dlb));
        return isNeg ? this.sub([0], resultDL) : resultDL;
    }
    
    OP.mul = (a, b) => {
        const rs = a.sign * b.sign;
        if (! rs) return PF(0);
        if (a.digits == 1) return b.shift(a.exp).withSign(rs);
        if (b.digits == 1) return a.shift(b.exp).withSign(rs);
        
        const re = a.exp + b.exp;
        
        let resultDL = DL.mul(DL.fromString(a.digits), DL.fromString(b.digits));
        
        
        return PF(DL.stringify(resultDL)).shift(re).withSign(rs);
    }
    
    // Works on absolute values
    // Uses repeated subtraction, SLOW with big bases
    ALGO.longDivSub = (dla, dlb) => {
        dla = DL.abs(dla);
        dlb = DL.abs(dlb);
        let i = dla.length - dlb.length;
        
        let mod = dla.slice(i);
        if (DL.cmp(mod, dlb) < 0) mod.unshift(dla[--i]);
        let mod_ = mod;
        const revRes = [];
                
        while (true) {
            let cr = 0;
            while (! (mod_ = DL.sub(mod, dlb))[SED]) {
                cr++;
                mod = mod_;
            }
            revRes.push(cr);
            
            if (!i) return revRes.reverse();
            
            mod.unshift(dla[i - 1]);
            i--;
        }
    }
    
    // Works on absolute values
    ALGO.longDivMul = (dla, dlb) => {
        dla = DL.abs(dla);
        dlb = DL.abs(dlb);
        let i = dla.length - dlb.length;
        
        let mod = dla.slice(i);
        if (DL.cmp(mod, dlb) < 0) mod.unshift(dla[--i]);
        let mod_ = mod;
        const revRes = [];
        
        const dvsrMSD = dlb[dlb.length - 1];
        
        while (true) {
            let modMSDs = mod[mod.length - 1];
            if (mod.length > dlb.length) {
                modMSDs = modMSDs * BASE + mod[mod.length - 2];
            }
            let cr = Math.floor(modMSDs / dvsrMSD);
            if (cr) {
                const modMul = DL.mul(dlb, [cr % BASE, Math.floor(cr / BASE)]);
                mod = DL.sub(mod, modMul);
            }
            if (mod[SED]) { // overshoot
                while ( (mod = DL.add(mod, dlb))[SED] ) {
                    cr--;
                }
                cr--;
            } else {
                while (! (mod_ = DL.sub(mod, dlb))[SED]) {
                    cr++;
                    mod = mod_;
                }
            }
            revRes.push(cr);
            
            if (!i) return revRes.reverse();
            
            mod.unshift(dla[i - 1]);
            i--;
        }
    }
    
    DL.idiv = function (dla, dlb) {
        const isNeg = (!dla[SED] != !dlb[SED]);
        dla = this.abs(dla);
        dlb = this.abs(dlb);
        const cmp = DL.cmp(dla, dlb);
        let resultDL;
        switch (true) {
            case 0 == cmp:
                resultDL = [1];
                break;
            case 0 > cmp:
                resultDL = [0];
                break;
            default:
                resultDL = ALGO.longDivMul(dla, dlb);
        }
        return isNeg ? this.sub([0], resultDL) : resultDL;
    }
    
    OP.div = (a, b, decPl) => {
        if (! b.sign) throw new RangeError('Divide by 0');
        const rs = a.sign * b.sign;
        if (! rs) return PF(0); // dividend == 0
        if (b.digits == 1) return a.shift(-b.exp).withSign(rs).truncate(decPl);
        if (a.digits == b.digits) return PF(1).shift(a.exp - b.exp).withSign(rs).truncate(decPl);
        
        // find the common exponent
        const pfs = [a, b];
        let commonExp = Math.min(...pfs.map(pf => pf.exp));
        // right pad with 0s, to equalize the exponents
        const strs = pfs.map(
            pf => pf.digits + '0'.repeat(pf.exp - commonExp)
        );
        
        let resultExp = 0;
        if (decPl > 0) {
            strs[0] += '0'.repeat(decPl);
            resultExp = -decPl;
        }
        
        const [dla, dlb] = strs.map(str => DL.fromString(str));
            
        const resultDL = DL.idiv(dla, dlb);
        return PF(DL.stringify(resultDL)).shift(resultExp).withSign(rs).truncate(decPl);
    }
    
    const FUNC = {
        add: (a, b) => OP.sum(PF(a), PF(b)) + '',
        subtract: (a, b) => OP.sum(PF(a), PF(b).negate()) + '',
        multiply: (a, b) => OP.mul(PF(a), PF(b)) + '',
        divide: (a, b, decPl = 0) => OP.div(PF(a), PF(b), decPl) + '',
    }
    
    return FUNC;
})();