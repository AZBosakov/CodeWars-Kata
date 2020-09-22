const DEBUG = {
    attacked: arr => arr.map(e => e.toString(2).replace('-', '')).join("\n"),
};

/**
 * Solve N-queens for n <= 32
 * 
 * Return a single solution of the N-queens if any or false otherwise.
 * Artificialy limited to max. size 32 - the bit width of a JS int - 
 * due to the chosen algo. for checking safe squares.
 * 
 * @param int size : 1..32 - The size of the board - size x size
 * @param array|false fixQueen - The [row, col] (0-based) of the fixed queen if given
 * @return array|false - The array of fixQueens' positions or false if no solution
 */
const nQueenSolver_max32 = (size, fixQueen = false) => {
    // Rows will be represented as bitfields of unsafe squares, so max 32 cols
    const JS_INT_BITS = 32;
    if (JS_INT_BITS < size) throw new Error(`Size too big: ${size}. Max size: ${JS_INT_BITS}`);
    
    if (1 > size) throw new Error(`Invalid size: ${size}. Must be positive int`);
    
    if (fixQueen[0] > size || fixQueen[1] > size) throw new Error(`Invalid position: ${position}`);
    
    if (1 == size) return [0,0];
    if (4 > size) return false;
    
    // Mark the highest bits above 'size' as attacked
    const maxSafeCols = JS_INT_BITS == size ? 0 : ((1 << 31) >> (31 - s));
    const attacked = (new Uint32Array(size)).fill(maxSafeCols);
    
    const fixQueenRow = fixQueen ? fixQueen[0] : -1;
    const fixQueenCol = fixQueen ? (1 << fixQueen[1]) : 0;
    
    // Mark the squares, attacked by the fixed queen, if given
    if (fixQueen) attacked.forEach((e, i, arr) => {
        let diff = i - fixQueenRow;
        if (diff) {
            attacked[i] |= fixQueenCol | (fixQueenCol << diff) | (fixQueenCol >>> diff);
        }
    });
    
    DEBUG.attacked(attacked);
}