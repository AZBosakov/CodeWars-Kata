// https://www.codewars.com/kata/5b5fe164b88263ad3d00250b/train/javascript

'use strict';

// const alphametics = (() => { //TODO
    
    
    const BASE = 10;
    // Bits 0..BASE-1, corresponding to each digit
    const [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9] = [...Array(BASE).keys()].map(e => 1 << e);
    // Util: 
    const $ = (...digList) => digList.reduce((acc, e) => acc | (1 << e) , 0);
    
    const ALL = (1 << BASE) - 1;
    const ODD = ALL & 0xAAAAAAAA; // bits 1,3,5,...
    const EVEN = ALL & ~ODD; // bits 0,2,4...

    
//     return s => { //TODO
    const alphametics = puzzle => {
        // normalize
        const words = puzzle.trim().split(/\s*(?:\+|=)\s*/);
        const nonZero = words.map(w => w[0]);
        
        
    }
// })(); //TODO
