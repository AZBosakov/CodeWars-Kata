/*
 * Not optimized for performance, instruction set functions
 * are recreated on every call. But being in scope -> simpler to write.
 */
const interpret = code => {
    const IP = [0, 0]; // [X, Y]
    const stack = [];
    
    // Flags
    const STOP  = 1 << 0; // Terminate
    const MOVE  = 1 << 1; // 1: r/d, 0: l/u
    const VERT  = 1 << 2; // 0: l/r, 1: u/d
    const STRM  = 1 << 3; // STRing Mode
    // Control Register
    let CR = MOVE;
    
    let output = '';
    
    const NOP = ' ';
    
    let codeGrid = (() => {
        const lines = code.split("\n");
        // right-pad with spaces to make it rectangular, if it isn't already
        const maxW = Math.max(...lines.map(line => line.length));
        return lines.map(l => (l + NOP.repeat(maxW - l.length)).split(''));
    })();
    
    const gridSize = [code[0].length, code.length]; // code grid's [W, H]
    
    //
    const push = (...e) => stack.push(...e);
    /*
     * If insufficient elements, pops 0s; always returns an array,
     * even for count 1.
     */
    const pop = (count = 1) => {
        const els = stack.splice(-count).reverse();
        const diff = count - els.length;
        if (diff) {
            return els.concat(Array(diff).fill(0));
        }
        return els;
    }
    
    // Instruction Set {
    const IS = {
        // 0...9
        ...Array.from(Array(10).keys()).reduce((acc, e) => {
            acc[e] = () => push(e);
            return acc;
        }, {}),
        
    }
    // } Instruction Set
    
    while(!STOP) {
        // TODO: instruction cycle
    }
    
    return output;
}