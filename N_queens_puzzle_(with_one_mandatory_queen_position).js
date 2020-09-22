
/**
 * Solve N-queens for n <= 32
 * 
 * Return a single solution of the N-queens if any or false otherwise.
 * Artificialy limited to max. size 32 - the bit width of a JS int - 
 * due to the chosen algo. for checking safe squares.
 * 
 * Recursively places queens on safe squares on subsequent rows.
 * On each placement, marks the lower rows' squares, attacked by this queen,
 * and pass the marked sqares for the next queen. If the lower queens placement fails,
 * try the next safe square on the row and repeat the above.
 * 
 * If successful, returns array of type [qRow_0_col, qRow_1_col, qRow_2_col, ...]
 * 
 * NOTE: Haven't compared performance with other algorythms,
 * but on my ancient Celleron E3300 / Chrome 80 solves 30 queens in ~15 sec
 * 
 * @param int size : 1..32 - The size of the board - size x size
 * @param array|false fixQueen - The [row, col] (0-based) of the fixed queen if given
 * @return array|false - The array of queens' positions or false if no solution
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
    const maxSafeCols = JS_INT_BITS == size ? 0 : ((1 << 31) >> (31 - size));
    const attackedInit = (new Uint32Array(size)).fill(maxSafeCols);
    
    const fixQueenRow = fixQueen ? fixQueen[0] : -1;
    const fixQueenCol = fixQueen ? (1 << fixQueen[1]) : 0;
    
    // Mark the squares, attacked by the fixed queen, if given
    if (fixQueen) attackedInit.forEach((e, i, arr) => {
        let diff = Math.abs(i - fixQueenRow);
        if (diff) {
            arr[i] |= (fixQueenCol | (fixQueenCol << diff) | (fixQueenCol >>> diff));
        }
    });
    
    const placeQueen = (queenRow, attackedSq) => {
        let row = attackedSq[0];
        // If the fixed queen
        if (fixQueenRow == queenRow) {
            // If on last row
            if (1 == attackedSq.length) return [fixQueenCol];
            const lowerQueens = placeQueen(queenRow + 1, attackedSq.slice(1));
            return lowerQueens ? [fixQueenCol, ...lowerQueens] : false;
        }
        let safe = 0;
        while (safe = (~row & (row + 1))) {
            if (1 == attackedSq.length) return [safe];
            // Mark the squares on the lower rows attacked by this queen
            const lowerRows = attackedSq.slice(1)
            for (let i = lowerRows.length; i--; ) {
                let d = i + 1;
                lowerRows[i] |= ((safe << d) | safe | (safe >>> d));
            }
            const lowerQueens = placeQueen(queenRow + 1, lowerRows);
            if (lowerQueens) return [safe, ...lowerQueens];
            row |= safe;
        }
        return false;
    }
    
    const result = placeQueen(0, attackedInit);
    if (! result) return false;
    return result.map(e => Math.log2(e));
}