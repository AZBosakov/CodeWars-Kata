/*
 * Instruction set functions are recreated on every call.
 * But being in scope -> simpler to write.
 * No error checks - expects valid code!
 */
const interpret = code => {
    const IP = [0, 0]; // [row, col] - WARNING - swapped X,Y
    const stack = [];
    const M_H   = 1 << 0; // move 1:horiz., 0:vert.
    const M_RD  = 1 << 1; // move 1:rigth/down, 0:left/up
    let IPdir = M_H|M_RD;
    let running = true;
    let stringMode = false;
    
    let output = '';
    
    const NOP = ' ';
    // " Start/stop string mode: push each character's ASCII value all the way up to the next ".
    const STR_MODE = '"';
    
    let grid = (() => {
        const lines = code.split("\n");
        // right-pad with spaces to make it rectangular, if it isn't already
        const maxW = Math.max(...lines.map(line => line.length));
        return lines.map(
            l => (l + NOP.repeat(maxW - l.length)).split('')
        );
    })();
    
    const gridSize = [
        grid.length,    // rows
        grid[0].length, // cols
    ];
    
    const push = (...e) => stack.push(...e);
    /*
     * If insufficient elements, pops 0s; always returns an array,
     * even for count 1.
     */
    const pop0 = (count = 1) => {
        const els = stack.splice(-count).reverse();
        const miss = count - els.length;
        return miss ? els.concat(Array(miss).fill(0)) : els;
    }
    
    const setDir = {
        right: () => IPdir = M_H|M_RD,
        left: () => IPdir = M_H,
        down: () => IPdir = M_RD,
        up: () => IPdir = 0,
        random: () => IPdir = (Math.random() * 100) & (M_H|M_RD),
    }
    
    const moveIP = () => {
        const coord = IPdir & M_H;
        const cur = IP[coord];
        const size = gridSize[coord];
        // IPdir & M_RD is either 2 or 0
        IP[coord] = (cur + (IPdir & M_RD) - 1 + size) % size;
    }
    
    const get = (r, c) => String(grid[r % gridSize[0]][c % gridSize[1]]).charCodeAt(0);
    
    const put = (r, c, v) => grid[r % gridSize[0]][c % gridSize[1]] = String.fromCharCode(v);
    
    // Instruction Set {
    const IS = {
        // 0-9 Push this number onto the stack.
        ...Array.from(Array(10).keys()).reduce((acc, e) => {
            acc[e] = () => push(e);
            return acc;
        }, {}),
        
        // +-*/% Addition: Pop a, b; push b-op-a.
        '+': ([a, b] = pop0(2)) => push(b + a),
        '-': ([a, b] = pop0(2)) => push(b - a),
        '*': ([a, b] = pop0(2)) => push(b * a),
        // int div; if div-by-0, push 0
        '/': ([a, b] = pop0(2)) => push((b / a)|0),
        '%': ([a, b] = pop0(2)) => push((b % a)|0),
        
        // ! Logical NOT: Pop a. If the value is zero, push 1; otherwise, push 0.
        '!': ([a] = pop0()) => push((a == 0)|0),
        // ` (backtick) Greater than: Pop a, b; push 1 if b>a, otherwise push 0.
        '`': ([a, b] = pop0(2)) => push((b > a)|0),
        
        // ><^v? Set direction
        '>': setDir.right,
        '<': setDir.left,
        '^': setDir.up,
        'v': setDir.down,
        '?': setDir.random,
        
        // _| Pop a; move right/down if a == 0, left/up otherwise
        '_': ([a] = pop0()) => a == 0 ? setDir.right() : setDir.left(),
        '|': ([a] = pop0()) => a == 0 ? setDir.down() : setDir.up(),
        
        // : Duplicate value on top of the stack. If there is nothing on top of the stack, push  0.
        ':': ([a] = pop0()) => push(a, a),
        // \ Swap two values on top of the stack. If there is only one value, pretend there is an extra 0 on bottom of the stack.
        '\\': ([a, b] = pop0(2)) => push(a, b),
        
        // $ Pop value from the stack and discard it.
        '$': pop0,
        // . Pop value and output as an integer.
        '.': ([a] = pop0()) => output += a,
        // , Pop value and output the ASCII character represented by the integer code that is stored in the value.
        ',': ([a] = pop0()) => output += String.fromCharCode(a),
        // # Trampoline: Skip next cell.
        '#': moveIP,
        // p A "put" call (a way to store a value for later use). Pop y, x and v, then change the character at the position (x,y) in the program to the character with ASCII value v.
        'p': ([r, c, v] = pop0(3)) => put(r, c, v),
        // g A "get" call (a way to retrieve data in storage). Pop y and x, then push ASCII value of the character at that position in the program.
        'g': ([r, c] = pop0(2)) => push(get(r, c)),
        // @ End program.
        '@': () => running = false,
        // ' ' (space) No-op.
        [NOP]: () => {},
    }
    // } Instruction Set
    
    while (running) {
        const [r, c] = IP;
        const char = grid[r][c];
        if (char == STR_MODE) {
            stringMode = !stringMode;
        } else {
            if (stringMode) {
                push(String(char).charCodeAt(0));
            } else {
                IS[char]();
            }
        }
        moveIP();
    }
    
    return output;
}