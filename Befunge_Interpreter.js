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
    let stringMode = false;
    let terminate = false;
    
    let output = '';
    
    const NOP = ' ';
    const STR_MODE = '"';
    
    let grid = (() => {
        const lines = code.split("\n");
        // right-pad with spaces to make it rectangular, if it isn't already
        const maxW = Math.max(...lines.map(line => line.length));
        return lines.map(l => (l + NOP.repeat(maxW - l.length)).split(''));
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
        const diff = count - els.length;
        if (diff) {
            return els.concat(Array(diff).fill(0));
        }
        return els;
    }
    
    /*
     * Get the value at the top of the stack.
     * Can return undefined, if stack is empty
     */
    const peek = () => stack[stack.length - 1];
    
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
    
    // Instruction Set {
    const IS = {
        // 0...9
        ...Array.from(Array(10).keys()).reduce((acc, e) => {
            acc[e] = () => push(e);
            return acc;
        }, {}),
        
        '+': ([a, b] = pop0(2)) => push(b + a),
        '-': ([a, b] = pop0(2)) => push(b - a),
        '*': ([a, b] = pop0(2)) => push(b * a),
        '/': ([a, b] = pop0(2)) => push(a == 0 ? a : (b / a)|0),
        '%': ([a, b] = pop0(2)) => push(a == 0 ? a : b % a),
        
        '!': ([a] = pop0()) => push((a == 0)|0),
        '`': ([a, b] = pop0(2)) => push((b > a)|0),
        
        '>': setDir.right,
        '<': setDir.left,
        '^': setDir.up,
        'v': setDir.down,
        '?': () => setDir.random,
        
        '_': ([a] = pop0()) => a == 0 ? setDir.right() : setDir.left(),
        '|': ([a] = pop0()) => a == 0 ? setDir.down() : setDir.up(),
        
        ':': (a = peek()) => push(a === undefined ? 0 : a),
        '\\': ([a, b] = pop0(2)) => push(a, b),
        '$': pop0,
        '.': ([a] = pop0()) => output += a,
        ',': ([a] = pop0()) => output += String.fromCharCode(a),
        '#': moveIP,
        'p': ([r, c, v] = pop0(3)) => grid[r % gridSize.h][c % gridSize.w] = v,
        'g': ([r, c] = pop0(3)) => push(
            String(grid[r % gridSize.h][c % gridSize.w]).charCodeAt(0)
        ),
        '@': () => terminate = true,
        [NOP]: () => {},
    }
    // } Instruction Set
    
    while(!terminate) {
        const [r, c] = IP;
        const char = grid[r][c];
        if (char == STR_MODE) stringMode = !stringMode;
        if (stringMode) {
            push(char);
        } else {
            console.log(char);
            
            IS[char]();
        }
        moveIP();
    }
    
    return output;
}