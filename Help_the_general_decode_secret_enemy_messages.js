'use strict'

device.decode = (() => {
    // WARNING: 1-based ! Ignore the first '_'
    const ALPHABET = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,? ';
    const INDEX = ALPHABET.split('').reduce(
        (acc, ch, i) => { acc.set(ch, i); return acc; },
        new Map()
    );
    INDEX.delete('_');
    
    const decoder = (ch, pos) => ch;
    
    return function (w) {
        return w.split('').map(decoder).join(''); 
    }
}());
