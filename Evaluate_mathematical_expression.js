// https://www.codewars.com/kata/52a78825cdfc2cfc87000005/train/javascript
'use strict';

const calc = (() => {
    // Token Types
    const [
        T_START, T_POS_N, T_INFIX, T_UNARY, T_OPEN, T_CLOSE, T_END
    ] = [...Array(32).keys()].map(e => 1 << e);
    // No WhiteSpace allowed after
    const NO_WS_AFTER = T_UNARY;
    // UTIL: Destruct the bits in an int to array of single bit ints
    function * bits(n) {
        let b;
        while (n ^= (b = n & ~(n - 1)), b) yield b;
    }
    
    const ASSOC_L = -1;
    const ASSOC_R = 1;
    // Typing saver
    const op = (func, prio, assoc = ASSOC_L) => ({func, prio, assoc});
    
    // Operators {
    const INFIX = {
        '+': op((a, b) => a+b, 0),
        '-': op((a, b) => a-b, 0),
        '*': op((a, b) => a*b, 1),
        '/': op((a, b) => a/b, 1),
    };
    
    const UNARY = {
        '-': op(a => -a, 2, ASSOC_R)
    }
    // Operators }
    
    // Typing saver
    const t = (match, next) => ({match, next});
    const TOKEN_TYPES = new Map([
        [ T_START, t(
            '^', T_POS_N|T_UNARY|T_OPEN )],
        [ T_UNARY, t(
            Object.keys(UNARY).join('|'), T_POS_N|T_OPEN )],
        [ T_POS_N, t(
            '\\d+(?:\\.\\d+)?', T_INFIX|T_CLOSE|T_END )],
        [ T_INFIX, t(
            Object.keys(INFIX).join('|'), T_UNARY|T_POS_N|T_OPEN )],
        [ T_OPEN, t(
            '(', T_POS_N|T_UNARY|T_OPEN )],
        [ T_CLOSE, t(
            ')', T_INFIX|T_CLOSE )],
        [ T_END, t(
            '^$', 0 )],
    ]);
    
    return expression => {
        expression = expression.trim();
        let curType = T_START;
        let curPos = 0;
        
        const tokens = [];
        
        while (curType != T_END) {
            const allowed = bits(TOKEN_TYPES.get(curType).next);
            for (let tType of allowed) {
                const tryToken = TOKEN_TYPES.get(tType);
            }
        }
        
        return tokens; // TEST
    }
})();