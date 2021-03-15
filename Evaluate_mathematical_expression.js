// https://www.codewars.com/kata/52a78825cdfc2cfc87000005/train/javascript

// Exceeds the kata requirements as an excersize, eg. added some validation.

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
        let b = 0;
        while (n ^= (b = n & ~(n - 1)), b) yield b;
    }
    
    const ASSOC_L = 0;
    const ASSOC_R = 1;
    
    const PRIO = Symbol.for('OPERATOR_PRIORITY');
    const ASSOC = Symbol.for('OPERATOR_ASSOCIATIVITY');
    
    // Typing saver
    const op = (func, prio, assoc = ASSOC_L) => Object.assign(func, {[PRIO]: prio, [ASSOC]: assoc});
    // Operators {
    const INFIX = {
        '+': op((a, b) => a+b, 0),
        '-': op((a, b) => a-b, 0),
        '*': op((a, b) => a*b, 1),
        '/': op((a, b) => a/b, 1),
        '^': op((a, b) => a**b, 2, ASSOC_R),
    };
    
    const UNARY = {
        '-': op(a => -a, 1, ASSOC_R)
    }
    // Operators }
    
    const PAREN_OPEN = Symbol.for('OPEN_PARENTHESIS');
    const PAREN_CLOSE = Symbol.for('CLOSE_PARENTHESIS');
    
    // Typing saver
    const t = (match, next, toCmd) => ({match, next, toCmd});
    const TOKEN_TYPES = new Map([
        [ T_START, t(
            '^', T_POS_N|T_UNARY|T_OPEN, () => PAREN_OPEN )],
        [ T_UNARY, t(
            Object.keys(UNARY).map(e => '\\'+e).join('|'), T_POS_N|T_OPEN, op => UNARY[op] )],
        [ T_POS_N, t(
            '\\d+(\\.\\d+)?', T_INFIX|T_CLOSE|T_END, n => +n )],
        [ T_INFIX, t(
            Object.keys(INFIX).map(e => '\\'+e).join('|'), T_UNARY|T_POS_N|T_OPEN, op => INFIX[op] )],
        [ T_OPEN, t(
            '\\(', T_POS_N|T_UNARY|T_OPEN, () => PAREN_OPEN )],
        [ T_CLOSE, t(
            '\\)', T_INFIX|T_CLOSE|T_END, () => PAREN_CLOSE )],
        [ T_END, t(
            '^$', 0, () => PAREN_CLOSE )],
    ]);
    
    return expression => {
        let curPos = expression.match(/^(\s*).*/)[1].length;
        expression = expression.trim();
        let curType = T_START;
        
        const cmds = [TOKEN_TYPES.get(T_START).toCmd()];
        
        let parens = []; // Check for unbalanced parentheses
        while (curType != T_END) {
            const allowed = bits(TOKEN_TYPES.get(curType).next);
            let typeMatched = 0;
            let strVal;
            for (let tType of allowed) {
                const tDescr = TOKEN_TYPES.get(tType);
                const matching = expression.match(RegExp(`^(${tDescr.match})(\\s*)(.*)`));
                if (! matching) continue;
                strVal = matching[1];
                const [space, rest] = matching.slice(-2);
                if ((tType & NO_WS_AFTER) && space.length) continue;
                cmds.push(tDescr.toCmd(strVal));
                typeMatched = curType = tType;
                curPos += strVal.length + space.length;
                expression = rest;
                break;
            }
            if (! typeMatched) throw new Error(`Invalid token '${strVal}' at ${curPos}`);
            if (T_OPEN == typeMatched) parens.push(curPos);
            if (T_CLOSE == typeMatched && parens.pop() === undefined) {
                throw new Error(`Closing parenthesis without matching oppening one at ${curPos}`);
            }
        }
        if (parens.length) {
            throw new Error(`Oppening parentheses without matching closing ones at ${parens}`);
        }
        
        return cmds; // TEST
    }
})();