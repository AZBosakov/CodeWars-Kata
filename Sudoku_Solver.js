/**
 * Generate a solver for sudokus 1x1 / 4x4 / 9x9 / 25x25
 * Limit to 25 due to using 32bit bitfields, and 25 is the largest square bellow 32.
 * 
 * @param int minorSquare : 1-5: The row length/count in a row of the minor squares
 * @param any emptyCell : The designator for unfilled cells
 * @param array numerals : The symbols used for the numbers. Must be of length at least minorSquare**2 
 * @return function : The solver for sudoku of size minorSquare**2 x minorSquare**2
 */
const createSudokuSolver = (
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
    const ROW_LEN = minorSquare**2;
    if (numerals.length < ROW_LEN) {
        throw new Error(
            `Not enough numerals (${numerals.length} provided) for sudoku of ${ROW_LEN}x${ROW_LEN}`
        );
    }
    const NUMERAL_INDEX = new Map(numerals.map((e, i) => [e, i]));
    if (NUMERAL_INDEX.size < numerals.length || NUMERAL_INDEX.has(emptyCell)) {
        throw new Error(`Duplicate numerals!`);
    }
    NUMERAL_INDEX.set(emptyCell, -1);
    
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
        const INIT_BITFIELD = ~((1 << ROW_LEN) - 1);
        const MIN_SQ = minorSquare;
        
        const [
            BI_ROWS,
            BI_COLS,
            BI_SQUS,
        ] = [0, 1, 2];
        // Bitmasks for numbers already present in the row/col/minor square
        const INIT_BITMASKS = [
            Array(ROW_LEN).fill(INIT_BITFIELD),
            Array(ROW_LEN).fill(INIT_BITFIELD),
            Array(ROW_LEN).fill(INIT_BITFIELD),
        ];
        
        const setBit = (bms, r, c, v) => {
            const nbm = bms.map(bm => bm.slice());
            nbm[BI_ROWS][r] |= v;
            nbm[BI_COLS][r] |= v;
            const sq = ((r / MIN_SQ)|0) * 3 + ((c / MIN_SQ)|0);
            nbm[BI_SQUS][sq] |= v;
        }
        
        const normalized = sudoku.map(
            row => row.map(
                if (row.length != ROW_LEN) {
                    throw new Error(`Invalid cell count in row ${ri}`);
                }
                cell => {
                    if (! NUMERAL_INDEX.has(cell)) {
                        throw new Error(`Undefined numeral at [${ri}][${ci}]`);
                    }
                    const n = NUMERAL_INDEX.get(cell);
                    
                    return ~n ? (1 << n) : 0;
                }
            );
        );
        
        const unfilled = normalized.reduce((acc, row) => {
            row.forEach((cell, col) = {
                if (! cell) acc.push([row, col]);
            });
            return acc;
        }, []);
        
        
        
        let solved = [...normalized];
        
        
        return solved;
    }
}

const sudoku = createSudokuSolver(3, 0, [1,  2,  3,  4,  5, 6,  7,  8,  9]);
