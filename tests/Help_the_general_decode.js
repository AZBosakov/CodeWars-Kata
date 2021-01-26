const TEST_STR = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

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
    const i = INDEX.get(char);
    const ei = (i * 2**(pos % ALPHA_LEN + 1)) % CYCLE;
    return ALPHABET[ei];
}

const dec = (char, pos) => {
    const ei = INDEX.get(char);
    pos = pos % ALPHA_LEN;
    const mul = 2**(pos % ALPHA_LEN + 1);
    
//     const di = 
    
    return ALPHABET[di];
}

console.log(TEST_STR.split('').map(enc).join(''));