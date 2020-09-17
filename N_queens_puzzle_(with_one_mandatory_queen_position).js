/**
 * Calculate the positions of the queens on the boards,
 * given 1 of them.
 * 
 * Artificialy limited to max. size 32 - the bit width of a JS int - 
 * due to the chosen algo. for checking safe squares. According to
 * https://en.wikipedia.org/wiki/Eight_queens_puzzle
 * the max. completely enumerated is 27x27 anyway.
 * 
 * @param string position - The position of the given fixed queen.
 * @param int size : 1..32 - The size of the board - size x size
 * @return array|false - The array of queens' positions or false if no solution
 */
const queens = (position, size) => {
    // Rows will be represented as bitfields of unsafe squares, so max 32 cols
    const JS_INT_BITS = 32;
    if (JS_INT_BITS < size) throw new Error(`Size too big: ${size}. Max size: ${JS_INT_BITS}`);
    
    if (1 > size || ) throw new Error(`Invalid size: ${size}. Must be positive int`);
    
    const colNames = 'abcdefghijklmnopqrstuvwxyzABCDEF';
    const posCol = colNames.indexOf(position[0]);
    const posRow = position[0] - 1;
    
    
    if (1 == size) return 'a1';
    if (4 > size) return false;
}