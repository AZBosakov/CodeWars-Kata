/*
 * Not optimized for performance, instruction functions are
 * recreated on every call. But being in scope -> simpler to write.
 */
const interpret = code => {
    const IP = [0, 0]; // [X, Y]
    const stack = [];
    let IPdir = [1, 0];
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
    
    const gridSize = {
        w: grid[0].length,
        h: grid.length,
    }
    
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
     * Can return undefined, if stack empty
     */
    const peek = () => stack[stack.length - 1];
    
    const dir = {
        right: () => IPdir = [1, 0],
        left: () => IPdir = [-1, 0],
        down: () => IPdir = [0, 1],
        up: () => IPdir = [0, -1],
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
        
        '>': dir.right,
        '<': dir.left,
        '^': dir.up,
        'v': dir.down,
        '?': () => Object.entries(dir)[(Math.random() * 100) & 3][1](),
        
        '_': ([a] = pop0()) => a == 0 ? dir.right() : dir.left(),
        '|': ([a] = pop0()) => a == 0 ? dir.down() : dir.up(),
        
        //[STR_MODE]: () => stringMode = !stringMode,
        ':': (a = peek()) => push(a === undefined ? 0 : a),
        '\\': ([a, b] = pop0(2)) => push(a, b),
        '$': pop0,
        '.': ([a] = pop0()) => output += a,
        ',': ([a] = pop0()) => output += String.fromCharCode(a),
        '#': () => trampoline = true,
        'p': ([r, c, v] = pop0(3)) => grid[r % gridSize.h][c % gridSize.w] = v,
        'g': ([r, c] = pop0(3)) => push(
            String(grid[r % gridSize.h][c % gridSize.w]).charCodeAt(0)
        ),
        '@': () => terminate = true,
        [NOP]: () => {},
    }
    // } Instruction Set
    
    while(!terminate) {
        // TODO: instruction cycle
    }
    
    return output;
}