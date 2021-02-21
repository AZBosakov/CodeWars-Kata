// https://www.codewars.com/kata/527fde8d24b9309d9b000c4e

'use strict'

/**
 * Trace the closed contours in a square grid
 * 
 * @param SYM_GRID Array[Array]
 * @param designate {
 *      CORNER : The grid element for contour corner,
 *      H_LINE : The grid element for horiz. line,
 *      V_LINE : The grid element for vert. line,
 *      BACK : The grid element for empty space (background),
 * }
 */
const sqGridContours = (SYM_GRID, {CORNER, H_LINE, V_LINE, BACK}) => {
    // Directions to neighbouring cells
    const R = 1 << 0;
    const D = 1 << 1;
    const L = 1 << 2;
    const U = 1 << 3;
    
    // grid symbol -> directions to neigbouring cells
    const MAP_SYM2DIR = new Map([
        [CORNER, R|D|L|U],
        [H_LINE, R|L],
        [V_LINE, D|U],
        [BACK, 0]
    ]);
    
    if (MAP_SYM2DIR.length < 4) throw new Error('{CORNER, H_LINE, V_LINE, BACK} must be distinct');
    
    // directions to neigbouring cells -> grid symbol
    const MAP_DIR2SYM = new Map(
        [...MAP_SYM2DIR.entries()].map( ([sym, dir]) => [dir, sym] )
    );
    
    const sym2dir = sym => MAP_SYM2DIR.has(sym) ? MAP_SYM2DIR.get(sym) : 0;
    const dir2sym = dir => MAP_DIR2SYM.has(dir) ? MAP_DIR2SYM.get(dir) : CORNER;
    
    const WIDTH = SYM_GRID.reduce((max, r) => Math.max(max, r.length), 0);
    
    const CONTOURS = [];
    // Can't have closed countours with single row/column
    if ((SYM_GRID.length < 2) || (WIDTH < 2)) return CONTOURS;
    // util
    const bitCount = n => {
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
    }
    
    // Normalize the grid
    const GRID = SYM_GRID.map(row => row.map(sym2dir));
    // Create empty grid with the dimensions of the input grid
    const getCanvas = () => Array(GRID.length).fill(0).map( () => Array(WIDTH).fill(0) );
    
    // TEST {
    let shape = GRID.map(row => row.map(dir2sym));
    CONTOURS.push({x: 0, y: 0, shape});
    // } TEST
    return CONTOURS;
}


const breakPieces = shape => {
    const grid = shape.split('\n').map(row => row.split(''));
    
    return sqGridContours(grid, {
        CORNER: '+',
        H_LINE: '-',
        V_LINE: '|',
        BACK: ' '
    }).map(
        ({shape}) => shape.map(
            row => row.join('')
        ).join('\n')
    );
};