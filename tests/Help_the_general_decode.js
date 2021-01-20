const TEST_STR = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

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


const enc = (char, pos) => {
    pos = pos;
    const i = INDEX.get(char);
//     const ei = (i * 2**(pos % 66 + 1)) % 66;
    const ei = (i * 2**(pos % ALPHA_LEN + 1)) % CYCLE;
    return ALPHABET[ei];
}

const dec = (char, pos) => {
    const ei = INDEX.get(char);
    
    const di = 
    
    return ALPHABET[di];
}

console.log(TEST_STR.split('').map(enc).join(''));