'use strict'

var device = device || {};

device.decode = (() => {
    // WARNING: 1-based ! Ignore the first '_'
    const ALPHABET = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,? ';
    const ALPHA_LEN = ALPHABET.length - 1;
    const CYCLE = ALPHA_LEN + 1;

    const INDEX = ALPHABET.split('').reduce(
        (acc, ch, i) => { acc.set(ch, i); return acc; },
        new Map()
    );
    INDEX.delete('_');
    
    // position % ALPHA_LEN => Multiplier Modulus for the symbol index
    // pos => 2**(pos % ALPHA_LEN + 1) % CYCLE
    // pos is 0-based
    const PC = 50; // power chunks: 2**50 < Number.MAX_SAFE_INTEGER;
    const mm = pos => {
        const pwr = pos % ALPHA_LEN + 1;
        let x = 1;
        for (let i = (pwr/PC)|0; i; i--) {
            x *= 2**PC % CYCLE;
        }
        return x * 2**(pwr % PC) % CYCLE;
    }

    // Translated from python:
    // https://brilliant.org/wiki/extended-euclidean-algorithm/?subtopic=integers&chapter=greatest-common-divisor-lowest-common-multiple#python-solution
    const extEuclid = (a, b) => {
        let [xg,yg, u,v] = [0,1, 1,0];
        while (a) {
            const [q, r] = [(b/a)|0, b%a];
            const [m, n] = [xg-u*q, yg-v*q];
            [b,a, xg,yg, u,v] = [a,r, u,v, m,n];
        }
        let gcd = b;
        return {gcd, xg, yg};
    }
    // The encoding algo, as deduced from the example encoded strings
    // pi: plaintext index, ei: encrypted index (1-based)
    const encode = (char, pos) => {
        const pi = INDEX.get(char);
        if (! pi) return char;
        const ei = pi * mm(pos) % CYCLE;
        return ALPHABET[ei];
    }
    
    const decode = (char, pos) => {
        const ei = INDEX.get(char);
        if (! ei) return char;
        const {gcd, xg, yg} = extEuclid(mm(pos), CYCLE);
        const pi = ((xg * (ei / gcd)) % CYCLE + CYCLE) % CYCLE;
        
        return ALPHABET[pi];
    }
    
    return function (w) {
        return w.split('').map(decode).join(''); 
    }
})();
