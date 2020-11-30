/**
 * Generate a solver for square sudokus
 * 
 * @param array[array[string|number]] template :
 *      A square array of symbols, distinct symbols belonging to different regions.
 *      Each symbol must occur n-times, where n is the length of the square of the puzzle
 * @param string|number emptyCell : The symbol designating unfilled cells
 * @param array[string|number] numerals : The symbols used for the numbers.
 * @return function : The solver for the sudoku type
 */
const createSudokuSolver = (
    template = [
        [0,0,0,1,1,1,2,2,2],
        [0,0,0,1,1,1,2,2,2],
        [0,0,0,1,1,1,2,2,2],
        [3,3,3,4,4,4,5,5,5],
        [3,3,3,4,4,4,5,5,5],
        [3,3,3,4,4,4,5,5,5],
        [6,6,6,7,7,7,8,8,8],
        [6,6,6,7,7,7,8,8,8],
        [6,6,6,7,7,7,8,8,8],
    ],
    emptyCell = 0,
    numerals = [
        1,  2,  3,  4,  5,  6,  7,  8,  9,  10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
    ] // Default, usefull for the usual 1-9 or the max size
) => {
    const SIZE = template.length;
    const INT_WIDTH = 32;
    if (SIZE < 1 || SIZE > INT_WIDTH) {
        throw new Error(`Invalid template size (1-32): ${SIZE}`);
    }
    if (numerals.length < SIZE) {
        throw new Error(
            `Not enough numerals (${numerals.length} provided) for sudoku of ${SIZE}x${SIZE}`
        );
    }
    const NUM_IDX = new Map(numerals.map((e, i) => [String(e), i]));
    if (NUM_IDX.size < numerals.length || NUM_IDX.has(String(emptyCell))) {
        throw new Error(`Duplicate numerals or empty cell symbol used as numeral!`);
    }
    NUM_IDX.set(String(emptyCell), -1);
    const regSyms = new Map();
    template.forEach(row => row.forEach(
        cell => {
            cell = String(cell);
            const enc = regSyms.get(cell)|0;
            regSyms.set(cell, enc + 1);
        }
    ));
    const ents = [...regSyms.entries()];
    
    
    const INIT_BITS = SIZE == 32 ? 0 : (-1 << SIZE);
    /**
     * Solve the sudoku
     * 
     * @param array[array] sudoku : 2 dim. array[r][c] of the sudoku cells
     * @return array[array] : 2 dim. array[r][c] of the filled sudoku cells
     */
    return sudoku => {
        if (sudoku.length != SIZE) {
            throw new Error(`Invalid size: ${sudoku.length}. Must be ${SIZE}x${SIZE}`);
        }
        // Bitmasks for used numbers. 0s are for numbers, not yet used in a row/col/region
        const ROW = Array(SIZE).fill(INIT_BITS);
        const COL = Array(SIZE).fill(INIT_BITS);
        const REG = Array(SIZE).fill(INIT_BITS);
        
        
        const normalized = sudoku.map(
            (row, ri) => {
                if (row.length != SIZE) {
                    throw new Error(`Not a square: invalid cell count in row ${ri}`);
                }
                return row.map(
                    (cell, ci) => {
                        if (! NUM_IDX.has(String(cell))) {
                            throw new Error(`Undefined numeral at [${ri}][${ci}]`);
                        }
                        return NUM_IDX.get(String(cell));
                    }
                );
            }
        );
        
        const unfilled = [];
        const nextUnIdx = 0;
        
        /**
         * Check for invalid sudoku with dupliacte numerals,
         * init the bitmasks and the unfilled cell list.
         */
        normalized.forEach(
            (row, ri) => row.forEach(
                (cell, ci) => {
                    const possible = getBits(INIT_BITMASKS, ri, ci);
                    const cellBit = ~cell ? (1 << cell) : 0;                    
                    if (cellBit && !(cellBit & possible)) {
                        const sym = numerals
                        throw new Error(
                            `Invalid sudoku: duplicate ${numerals[cell]} at [${ri}][${ci}]`
                        );
                    }
                    setBit(INIT_BITMASKS, ri, ci, cellBit, false);
                    if (! cellBit) unfilled.push({row: ri, col: ci, bit: 0});
                }
            )
        );
        
        const solved = sudoku.map(row => row.slice());
        
        const LAST_UNF = unfilled.length - 1;
        
        const tryCell = (nextUnIdx, bitMask) => {
            if (nextUnIdx > LAST_UNF) return true;
            const {row, col} = unfilled[nextUnIdx];
            let possible = getBits(bitMask, row, col);
            while (possible) {
                const tryBit = possible & ~(possible - 1);
                const success = tryCell(nextUnIdx + 1, setBit(bitMask, row, col, tryBit));
                if (success) {
                    unfilled[nextUnIdx].bit = tryBit;
                    return true;
                }
                possible ^= tryBit; // clear the last tried bit
            }
            return false;
        };
        
        const success = tryCell(nextUnIdx, INIT_BITMASKS);
        if (! success) throw new Error(`Cant solve sudoku!`);
        
        unfilled.forEach(({row, col, bit}) => {
            const normVal = Math.log2(bit);
            solved[row][col] = numerals[normVal];
        });
        return solved;
    }
}

const sudoku = createSudokuSolver();
