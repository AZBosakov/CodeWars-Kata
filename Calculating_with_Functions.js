// https://www.codewars.com/kata/525f3eda17c7cd9f9e000b39

const [
    zero, one, two, three, four,
    five, six, seven, eight, nine
] = 'zero, one, two, three, four, five, six, seven, eight, nine'.split(/\W+/).map(
    (name, i) => fn => fn ? fn(i) : i
);

const plus = n => x => x + n;
const minus = n => x => x - n;
const times = n => x => x * n;
const dividedBy = n => x => Math.floor(x / n);
