// https://www.codewars.com/kata/527fde8d24b9309d9b000c4e

'use strict'

const DIR_BITS = Symbol.for('DIR_BITS');
/**
 * Trace the closed contours in a square grid
 * 
 * @param GRID Array[Array] Array of bitfields of the directions to neighbouring cells
 */
const sqGridContours = (() => {
    // Directions to neighbouring cells, CW from Right, bits
    // WARNING: The util funcs bellow depend on this bit ordering
    const R = 1;        // 0001
    const D = R << 1;   // 0010
    const L = D << 1;   // 0100
    const U = L << 1;   // 1000
    
    const RL = R|L;
    const DU = D|U;
    
    const RD = R|D;
    
    const RDLU = R|D|L|U
    
    const DIR_COUNT = 4;
    
    // dir. bit -> [+row, +col]
    const dir2grid = db => [
        ((db & D) >> 1) - ((db & U) >> 3),
        (db & R) - ((db & L) >> 2)
    ];
    
    const dirBitRot = (db, r) => {
        db &= RDLU;
        r = ((r % DIR_COUNT) + DIR_COUNT) % DIR_COUNT;
        db <<= r;
        return (RDLU & (db | (db >> DIR_COUNT)));
    }
    
    const oppDir = db => dirBitRot(db, 2);
    
    // copy/paste
    const bitCount = n => {
        if (! n) return 0;
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    }
    
    const tracer = (GRID) => {
        const WIDTH = GRID.reduce((max, r) => Math.max(max, r.length), 0);
        
        const CONTOURS = [];
        // Can't have closed countours with single row/column
        if ((GRID.length < 2) || (WIDTH < 2)) return CONTOURS;
        // Create empty grid with the dimensions of the input grid
        const getCanvas = () => Array(GRID.length).fill(0).map( () => Array(WIDTH).fill(0) );
        
        // Bounds checked GRID[row][col]
        const cellAt = (row, col, rel = [0, 0]) => {
            row += rel[0];
            col += rel[1];
            if (
                row < 0 || row >= GRID.length || col < 0 || col > GRID[row].length
            ) return 0;
            return GRID[row][col];
        }
        // SET and RETURN the bitfield of the directions to the cells connected to this one
        const connects = (row, col) => {
            const dirs = cellAt(row, col) & RDLU;
            if (! dirs) return 0;
            let conn = 0;
            for (let b = U; b; b >>= 1) {
                if (
                    (dirs & b) && (cellAt(row, col, dir2grid(b)) & oppDir(b))
                ) conn |= b;
            }
            GRID[row][col] = conn; // side effect
            return conn;
        }
        
        // Clear 0- and single-connected cells, starting from (row, col)
        const clearLoose = (row, col) => {
            let conn;
            let dc;
            while (
                (conn = connects(row, col)) && 
                (bitCount(conn) == 1)
            ) {
                const nextTo = dir2grid(conn);
                GRID[row][col] = 0;
                row += nextTo[0];
                col += nextTo[1];
            }
        }
        
        /**
         * Clear the loose ends, if any, e.g.:
         * --+  |             
         *  ++-++++    ==>    +--+--+
         *  | ++--|           |  |  |
         *  +--+--+           +--+--+
         */
        for (let row = 0; row < GRID.length; row++) {
            for (let col = 0; col < GRID[row].length; col++) {
                clearLoose(row, col);
            }
        }
        
        
        
        // TEST {
        CONTOURS.push({x: 0, y: 0, contour: GRID.map(r => [...r])});
        
    //     console.log(GRID.map(row => row.map(bitCount).join('')).join('\n'));
        // } TEST
        
        
        /**
         * Start from an upper left corner, go to the right,
         * turn always right, and if going up when hitting the starting cell,
         * add the traced contour to CONTOURS
         */
        const trace = (row, col) => {
            const rowStart = row;
            const colStart = col;
            const rows = [row, row];
            const cols = [col, col];
            let to = R;
            const canvas = getCanvas();
            canvas[row][col] = R|D;
            while (true) {
                const [dr, dc] = dir2grid(to);
                row += dr;
                col += dc;
                if (rowStart == row && colStart == col) {
                    if (U == to) {
                        // TODO: trim
                        CONTOURS.push({x:0, y:0, contour: canvas});
                    }
                    break;
                }
                const from = oppDir(to);
                const conn = GRID[row][col];
                for (to = dirBitRot(from, -1); !(to & conn); to = dirBitRot(to, -1)) ;
                canvas[row][col] = from|to;
            }
            
            // Clear the traced contour from the grid, to avoid duplicates on concave shapes
            GRID[rowStart][colStart] = 0;
            clearLoose(rowStart, colStart + 1);
            clearLoose(rowStart + 1, colStart);
        }
        
        // Trace shapes pass
        for (let row = 0; row < GRID.length; row++) {
            for (let col = 0; col < GRID[row].length; col++) {
                if (RD == (GRID[row][col] & RD)) trace(row, col);
            }
        }
        
        return CONTOURS;
    }
    
    tracer[DIR_BITS] = {R, D, L, U};
    return tracer;
})();


const breakPieces = shape => {
    const grid = shape.split('\n').map(row => row.split(''));
    const {R, D, L, U} = sqGridContours[DIR_BITS];
    
    const CORNER = '+';
    const H_LINE = '-';
    const V_LINE = '|';
    const BACK = ' ';
    
    // grid symbol -> directions to neigbouring cells
    const MAP_SYM2DIR = new Map([
        [CORNER, R|D|L|U],
        [H_LINE, R|L],
        [V_LINE, D|U],
        [BACK, 0]
    ]);
    
    // directions to neigbouring cells -> grid symbol
    const MAP_DIR2SYM = new Map(
        [...MAP_SYM2DIR.entries()].map( ([sym, dir]) => [dir, sym] )
    );
    
    const sym2dir = sym => MAP_SYM2DIR.has(sym) ? MAP_SYM2DIR.get(sym) : 0;
    const dir2sym = dir => MAP_DIR2SYM.has(dir) ? MAP_DIR2SYM.get(dir) : '+';
    // Normalize the grid
    const GRID = grid.map(row => row.map(sym2dir));
        
        
    
    return sqGridContours(grid.map(row => row.map(sym2dir))).map(
        ({contour}) => contour.map(
            row => row.map(dir2sym).join('')
        ).join('\n')
    );
};