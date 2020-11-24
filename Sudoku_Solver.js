/**
 * @param int minSqSize : The size of the minor squares
 * @return function : The solver for sudoku of size minSqSize**2 x minSqSize**2
 */
const createSolver = (minSqSize = 3) => {
    if (minSqSize < 1 || minSqSize > 5) {
        throw new Error(`Minor square size out of range: ${minSqSize}`);
    }
    const INIT_BITFIELD = 
    
    return sudoku => {
        const solved = [...sudoku];
        
        
        return solved;
    }
}

const sudoku = createSolver(3); // solver for 9x9
