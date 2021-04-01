// https://www.codewars.com/kata/5b5fe164b88263ad3d00250b/train/javascript

'use strict';

// const alphametics = (() => { //TODO
    // code convention: all the $-prefixed vars/funcs are bitfields
    const BASE = 10;
    // Bits 0..BASE-1, corresponding to each digit
    const [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9] = [...Array(BASE).keys()].map(e => 1 << e);
    
    const $ALL = (1 << BASE) - 1;
    // Utils: digits => bitfield
    const $ = (...digList) => digList.reduce((acc, e) => (acc | (1 << e)) & $ALL , 0);
    const $lt = digit => $ALL & ((1 << digit) - 1);
    const $gt = digit => $ALL & ~((1 << ++digit) - 1);
    
//     return s => { //TODO
    const alphametics = puzzle => {
        // normalize
        const words = puzzle.trim().split(/\s*(?:\+|=)\s*/);
        const nonZero = words.map(w => w[0]);
        
        
    }
// })(); //TODO
