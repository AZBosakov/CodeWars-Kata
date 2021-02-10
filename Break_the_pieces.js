'use strict'

const CORNER = /[+]/;
const H_LINE = /[-]/;
const V_LINE = /[|]/;

const breakPieces = shape => {
    const ROWS = shape.split('\n');
    const WIDTH = ROWS.reduce((max, r) => Math.max(max, r.length), 0);
    
    const CORNERS = [];
    
    const getCanvas = () => Array(ROWS.length).fill(0).map(() => Array(WIDTH).fill(''));
    
    const traceShape = startCorner => {
        
    }
    
    
}