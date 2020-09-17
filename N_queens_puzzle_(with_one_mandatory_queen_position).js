/**
 * Solve N-queens for n <= 32
 * 
 * Return a single solution of the N-queens if any or false otherwise.
 * Artificialy limited to max. size 32 - the bit width of a JS int - 
 * due to the chosen algo. for checking safe squares.
 * 
 * @param int size : 1..32 - The size of the board - size x size
 * @param array|false queen - The [row, col] (0-based) of the fixed queen if given
 * @return array|false - The array of queens' positions or false if no solution
 */
const queenSolver_32 = (size, queen = false) => {
    // Rows will be represented as bitfields of unsafe squares, so max 32 cols
    const JS_INT_BITS = 32;
    if (JS_INT_BITS < size) throw new Error(`Size too big: ${size}. Max size: ${JS_INT_BITS}`);
    
    if (1 > size || ) throw new Error(`Invalid size: ${size}. Must be positive int`);
    
    if (queen[0] > size || queen[1] > size) throw new Error(`Invalid position: ${position}`);
    
    if (1 == size) return [0,0];
    if (4 > size) return false;
    
    
}