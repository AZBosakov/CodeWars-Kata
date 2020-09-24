/**
 * A slightly modified version of my previous solution - 5x faster.
 * 30 queens in ~3 sec on my ancient Celleron E3300 / Chrome 80
 */

/**
 * Solve N-queens for n <= 32 (backtracking)
 * 
 * Return a single solution of the N-queens if any or false otherwise.
 * Limited to max. size 32 - the bit width of a JS int - 
 * due to the chosen algo. for checking safe squares -
 * attacked ones are represented as a bitmap.
 * 
 * Recursively tries to places queens on safe squares on subsequent ranks.
 * On each placement, marks the next rank squares, attacked by this queen,
 * and pass the marked sqares for the next queen. If the following queens placement fails,
 * try the next safe square on the rank.
 * 
 * If successful, returns array of type [rank0_file, rank1_file, rank2_file, ...]
 * 
 * @param int size : 1..32 - The size of the board - size x size
 * @param array|false fixQueen - The [rank, file] (0-based) of the fixed queen if given
 * @return array|false - The array of queens' positions or false if no solution
 */
const nQueenSolver_max32 = (size, fixQueen = false) => {
    // Ranks will be represented as bitfields of attacked squares, so max 32 files
    const JS_INT_BITS = 32;
    const MAX_BIT = JS_INT_BITS - 1;
    
    if (JS_INT_BITS < size) throw new Error(`Size too big: ${size}. Max size: ${JS_INT_BITS}`);
    if (1 > size) throw new Error(`Invalid size: ${size}. Must be positive int`);
    
    const LAST_Q = size - 1;
    if (fixQueen[0] > LAST_Q || fixQueen[1] > LAST_Q) throw new Error(`Invalid position: ${position}`);
    
    if (1 == size) return [0];
    if (4 > size) return false;
    
    // Mark the bits above 'LAST_Q' as attacked
    const initSafe = JS_INT_BITS == size ? 0 : ((1 << MAX_BIT) >> (MAX_BIT - size));
    const attackedInit = (new Uint32Array(size)).fill(initSafe);
    const fixQRank = fixQueen ? fixQueen[0] : -1;
    const fixQFile = fixQueen ? (1 << fixQueen[1]) : 0;
    
    // Mark the squares, attacked by the fixed queen, if given
    if (fixQueen) attackedInit.forEach((e, i, arr) => {
        let diff = Math.abs(i - fixQRank);
        if (diff) {
            arr[i] |= (fixQFile | (fixQFile << diff) | (fixQFile >>> diff));
        }
    });
    
    /**
     *  =, ///, ||||, \\\\
     * (QueenRank, LeftDiagS, FileS, RightDiagS)
     * lds, fs, rds - the squares on this rank, attacked by the previously placed queens
     */
    const placeQueen = (qr, lds, fs, rds) => {
        if (fixQRank == qr) {
            if (LAST_Q == qr) return [fixQFile];
            const nextQs = placeQueen(qr + 1,
                ((lds | fixQFile) << 1), (fs | fixQFile), ((rds | fixQFile) >>> 1)
            );
            return nextQs ? [fixQFile, ...nextQs] : false;
        }
        let attacked = attackedInit[qr] | lds | fs | rds;
        let safe = 0;
        while (safe = (~attacked & (attacked + 1))) {
            if (LAST_Q == qr) return [safe];
            const nextQs = placeQueen(qr + 1,
                ((lds | safe) << 1), (fs | safe), ((rds | safe) >>> 1)
            );
            if (nextQs) return [safe, ...nextQs];
            attacked |= safe;
        }
        return false;
    }
    
    const result = placeQueen(0, 0, 0, 0);
    if (! result) return false;
    return result.map(e => Math.log2(e));
}

// Kata test function
const queens = (position, size) => {
    const files = 'abcdefghijklmnopqrstuvwxyz';
    const file0based = files.indexOf(position[0]);
    const rank0based = ((position[1]|0) + 9) % 10;
    
    const solution = nQueenSolver_max32(size, [rank0based, file0based]);
    if (! solution) return false;
    return solution.map((f, r) => `${files[f]}${(r+1) % 10}`).join(',');
}
