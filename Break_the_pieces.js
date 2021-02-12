// https://www.codewars.com/kata/527fde8d24b9309d9b000c4e

'use strict'

/**
 * Trace the closed contours in a square grid
 * 
 * @param GRID Array[Array]
 * @param designate {
 *      CORNER : The grid element for contour corner,
 *      H_LINE : The grid element for horiz. line,
 *      V_LINE : The grid element for vert. line,
 *      BACK : The grid element for empty space (background),
 * }
 */
const sqGridContours = (GRID, {CORNER, H_LINE, V_LINE, BACK}) => {
    // Directions to neighbouring cells
    const N = 1 << 0;
    const E = 1 << 1;
    const S = 1 << 2;
    const W = 1 << 3;
    
    const H = E|W;
    const V = N|S;
    
    // grid symbol -> directions to neigbouring cells
    const MAP_SYM2DIR = new Map([
        [CORNER, H|V],
        [H_LINE, H],
        [V_LINE, V],
        [BACK, 0]
    ]);
    
    if (SYM2DIR.length < 4) throw new Error('{CORNER, H_LINE, V_LINE, BACK} must be distinct');
    
    // directions to neigbouring cells -> grid symbol
    const MAP_DIR2SYM = new Map(
        [...MAP_SYM2DIR.entries()].map([sym, dir] => [dir, sym])
    );
    
    const sym2dir = sym => MAP_SYM2DIR.has(sym) ? MAP_SYM2DIR.get(sym) : 0;
    const dir2sym = dir => MAP_DIR2SYM.has(dir) ? MAP_DIR2SYM.get(dir) : CORNER;
    
    const WIDTH = grid.reduce((max, r) => Math.max(max, r.length), 0);
    
    const CONTOURS = [];
    
    if ((GRID.length < 2) || (WIDTH < 2)) return CONTOURS;
    
    
    const getCanvas = () => Array(ROWS.length).fill(0).map(() => Array(WIDTH).fill(''));
    
    
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