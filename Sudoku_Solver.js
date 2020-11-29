/**
 * Generate a solver for sudokus 1x1 / 4x4 / 9x9 / 25x25
 * Limit to 25 due to using 32bit bitfields, and 25 is the largest square bellow 32.
 * 
 * @param int minorSquare : 1-5: The row length/count in a row of the minor squares
 * @param any emptyCell : The designator for unfilled cells
 * @param array numerals : The symbols used for the numbers. Must be of length at least minorSquare**2 
 * @return function : The solver for sudoku of size minorSquare**2 x minorSquare**2
 */
const createSudokuSolver_max5 = (
    minorSquare = 3, // minor squares: 3x3
    emptyCell = 0,
    numerals = [
        1,  2,  3,  4,  5,
        6,  7,  8,  9,  10,
        11, 12, 13, 14, 15,
        16, 17, 18, 19, 20,
        21, 22, 23, 24, 25
    ] // Default, usefull for the usual 1-9 or the max size
) => {
    if (minorSquare < 1 || minorSquare > 5) {
        throw new Error(`Minor square size out of range (1..5): ${minorSquare}`);
    }
    const ROW_LEN = minorSquare ** 2;
    if (numerals.length < ROW_LEN) {
        throw new Error(
            `Not enough numerals (${numerals.length} provided) for sudoku of ${ROW_LEN}x${ROW_LEN}`
        );
    }
    const NUMERAL_INDEX = new Map(numerals.map((e, i) => [String(e), i]));
    if (NUMERAL_INDEX.size < numerals.length || NUMERAL_INDEX.has(String(emptyCell))) {
        throw new Error(`Duplicate numerals or empty cell symbol used as numeral!`);
    }
    NUMERAL_INDEX.set(String(emptyCell), -1);
    
    /**
     * Solve the sudoku
     * 
     * @param array[array] sudoku : 2 dim. array[r][c] of the sudoku cells
     * @return array[array] : 2 dim. array[r][c] of the filled sudoku cells
     */
    return sudoku => {
        if (sudoku.length != ROW_LEN) {
            throw new Error(`Invalid row count`);
        }
        const INIT_BITS = ~((1 << ROW_LEN) - 1);
        const MIN_SQ = minorSquare;
        // Bitmask Index
        const [
            BI_ROWS,
            BI_COLS,
            BI_SQUS,
        ] = [0, 1, 2];
        // Bitmasks for numbers already present in the row/col/minor square
        const INIT_BITMASKS = [
            Array(ROW_LEN).fill(INIT_BITS),
            Array(ROW_LEN).fill(INIT_BITS),
            Array(ROW_LEN).fill(INIT_BITS),
        ];
        
        // The minor square of the cell [r,c]
        const msq = (r, c) => ((r / MIN_SQ)|0) * MIN_SQ + ((c / MIN_SQ)|0);
        
        // Mark a number as used in the corresponding row, col. and minor square
        const setBit = (bms, r, c, v, cloneBM = true) => {
            const nbms = cloneBM ? bms.map(bm => bm.slice()) : bms;
            nbms[BI_ROWS][r] |= v;
            nbms[BI_COLS][c] |= v;
            nbms[BI_SQUS][msq(r, c)] |= v;
            return nbms;
        }
        /**
         * Get a bitmask of the possible numbers for the [row, col]
         * An intersection of the sets of unused numbers for the
         * corresponding row, col. and minor square
         */
        const getBits = (bms, r, c) => ~(
            bms[BI_ROWS][r] | bms[BI_COLS][c] | bms[BI_SQUS][msq(r, c)]
        );
        
        const normalized = sudoku.map(
            (row, ri) => {
                if (row.length != ROW_LEN) {
                    throw new Error(`Invalid cell count in row ${ri}`);
                }
                return row.map(
                    (cell, ci) => {
                        if (! NUMERAL_INDEX.has(String(cell))) {
                            throw new Error(`Undefined numeral at [${ri}][${ci}]`);
                        }
                        return NUMERAL_INDEX.get(String(cell));
                    }
                );
            }
        );
        
        const unfilled = [];
        const next = 0;
        
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
                    if (! cellBit) unfilled.push([ri, ci]);
                }
            )
        );
        
        const solved = sudoku.map(row => row.slice());;
        // TODO: Fill the missing
        
        return solved;
    }
}

const sudoku = createSudokuSolver_max5(3, 0, [1,  2,  3,  4,  5, 6,  7,  8,  9]);
