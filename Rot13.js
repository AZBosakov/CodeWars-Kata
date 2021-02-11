// https://www.codewars.com/kata/530e15517bc88ac656000716

// Lookup Table
const lt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').reduce(
    (acc, e, i, arr) => {
        let cl = arr[(i+13) % 26];
        acc[e] = cl;
        acc[e.toLowerCase()] = cl.toLowerCase();
        return acc;
    }, {}
);

const rot13 = message => message.split('').map(e => lt[e] || e).join('');
