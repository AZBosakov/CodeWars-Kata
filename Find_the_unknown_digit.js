// https://www.codewars.com/kata/546d15cebed2e10334000ed9
// 4 kyu

const solveExpression = (() => {
    const UNKN = '?';
    const NUM = `-?[${UNKN}0-9]+`;
    const NOT_FOUND = -1;
    const OPS = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
    }
    
    const OP = Object.keys(OPS).map(op => `[${op}]`).join('|');
    
    const PATTERN = RegExp(`^\\s*(${NUM})\\s*(${OP})\\s*(${NUM})\\s*=\\s*(${NUM})`);
    const UNKN_G = RegExp(`\\${UNKN}`, 'g');
    const UNKN_LEAD = RegExp(`^-?\\${UNKN}.+`);
    
    // Replace Digit
    const rd = (num, d) => Number(String(num).replace(UNKN_G, d));
    // Leading Unknown
    const lu = num => !!String(num).match(UNKN_LEAD);
    
    return exp => {
        try {
            const [, n1, op, n2, res] = exp.match(PATTERN);
            const leading = lu(n1) || lu(n2) || lu(res);
            for (let d = (leading ? 1 : 0); d < 10; d++) {
                if (~exp.indexOf(d)) continue;
                if (OPS[op](rd(n1, d), rd(n2, d)) == rd(res, d)) return d;
            }
        } catch(e) {
            throw new Error(`Invalid expression: ${exp}`);
        }
        return NOT_FOUND;
    }
})()