const TEST_STR = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// const TEST_STR = 'What is this ?';

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
// pos => 2**(pos % ALPHA_LEN + 1)
const PC = 50; // power chunks: 2**50 < Number.MAX_SAFE_INTEGER;
const mm = pos => {
    const pwr = pos % ALPHA_LEN + 1;
    let x = 1;
    for (let i = (pwr/PC)|0; i; i--) {
        x *= 2**PC % CYCLE;
    }
    return x * 2**(pwr % PC) % CYCLE;
}

const gcd = (a, b) => a % b ? gcd(b, a % b) : Math.abs(b);

const enc = (char, pos) => {
    const i = INDEX.get(char);
    if (! i) return char;
    const ei = i * mm(pos) % CYCLE;
    return ALPHABET[ei];
}

const dec = (char, pos) => {
    const ei = INDEX.get(char);
    if (! i) return char;
    pos = pos % ALPHA_LEN;
    
    const mul = 2**(pos % ALPHA_LEN + 1);
    
//     const di = 
    
    return ALPHABET[di];
}
e = s => s.split('').map(enc).join('');
// console.log(TEST_STR.split('').map(enc).join(''));