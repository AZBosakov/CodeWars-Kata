// https://www.codewars.com/kata/527fde8d24b9309d9b000c4e

'use strict'

const CORNER = /[+]/;
const H_LINE = /[-]/;
const V_LINE = /[|]/;

const breakPieces = shape => {
    const ROWS = shape.split('\n');
    const WIDTH = ROWS.reduce((max, r) => Math.max(max, r.length), 0);
    
    const SHAPES = [];
    
    const CORNERS = ROWS.reduce(
        (acc, row) => {
            
            
            return acc;
        }, []
    );
    
    const getCanvas = () => Array(ROWS.length).fill(0).map(() => Array(WIDTH).fill(''));
    
    const trace = start => {
        
    }
}