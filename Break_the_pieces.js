// https://www.codewars.com/kata/527fde8d24b9309d9b000c4e

'use strict'

const DIR_BITS = Symbol.for('DIR_BITS');
/**
 * Trace the closed contours in a square grid
 * 
 * @param SYM_GRID Array[Array]
 * @param designate object {
 *      CORNER : The grid element for contour corner,
 *      H_LINE : The grid element for horiz. line,
 *      V_LINE : The grid element for vert. line,
 *      BACK : The grid element for empty space (background),
 * }
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
    
    
    const tracer = (SYM_GRID, {CORNER, H_LINE, V_LINE, BACK}) => {
        // grid symbol -> directions to neigbouring cells
        const MAP_SYM2DIR = new Map([
            [CORNER, RDLU],
            [H_LINE, RL],
            [V_LINE, DU],
            [BACK, 0]
        ]);
        
        if (MAP_SYM2DIR.size < 4) throw new Error('{CORNER, H_LINE, V_LINE, BACK} must be distinct');
        
        // directions to neigbouring cells -> grid symbol
        const MAP_DIR2SYM = new Map(
            [...MAP_SYM2DIR.entries()].map( ([sym, dir]) => [dir, sym] )
        );
        
        const sym2dir = sym => MAP_SYM2DIR.has(sym) ? MAP_SYM2DIR.get(sym) : 0;
        const dir2sym = dir => MAP_DIR2SYM.has(dir) ? MAP_DIR2SYM.get(dir) : CORNER;
        // Normalize the grid
        const GRID = SYM_GRID.map(row => row.map(sym2dir));
        const WIDTH = SYM_GRID.reduce((max, r) => Math.max(max, r.length), 0);
        
        const CONTOURS = [];
        // Can't have closed countours with single row/column
        if ((SYM_GRID.length < 2) || (WIDTH < 2)) return CONTOURS;
        // Create empty grid with the dimensions of the input grid
        const getCanvas = () => Array(GRID.length).fill(0).map( () => Array(WIDTH).fill(0) );
        
        // Bounds check on GRID[row][col]
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
            const dirs = cellAt(row, col);
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
        
        // Clear single-connected cells, starting from (row, col)
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
        
        // Clear loose ends pass
        for (let row = 0; row < GRID.length; row++) {
            for (let col = 0; col < GRID[row].length; col++) {
                clearLoose(row, col);
            }
        }
        
        const trace = (row, col) => {
            
        }
        
        // Trace shapes pass
        for (let row = 0; row < GRID.length; row++) {
            for (let col = 0; col < GRID[row].length; col++) {
                if (RD == (cellAt(row, col) & RD)) trace(row, col);
            }
        }
        
        // TEST {
        let shape = GRID.map(row => row.map(dir2sym));
        CONTOURS.push({x: 0, y: 0, contour: shape});
        
    //     console.log(GRID.map(row => row.map(bitCount).join('')).join('\n'));
        // } TEST
        
        return CONTOURS;
    }
    
    tracer[DIR_BITS] = {R, D, L, U};
    return tracer;
})();


const breakPieces = shape => {
    const grid = shape.split('\n').map(row => row.split(''));
    
    return sqGridContours(grid, {
        CORNER: '+',
        H_LINE: '-',
        V_LINE: '|',
        BACK: ' '
    }).map(
        ({contour}) => contour.map(
            row => row.join('')
        ).join('\n')
    );
};