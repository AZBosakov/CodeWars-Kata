var puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]];

var solution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]];
    

const createTpl = (sqLen, regLen) => Array(sqLen).fill(0).map(
    (r, ri) => Array(sqLen).fill(0).map(
        (c, ci) => {
            const inRow = sqLen / regLen;
            const inCol = sqLen / inRow;
            return ((ri/inRow)|0) * inRow + ((ci/inCol)|0);
        }
    )
);
    
const hexNums = '123456789ABCDEFG'.split('');
const hexudoku = 
` E      B 9   58
 D 8G 1   6     
GA  2DF      B3 
    6  B  5  7AC
 8       9      
   2   F  G  8EA
    9GC58    2F 
 6D9 B2  E7 3   
7G83 6B      4  
    E2  C    5 6
    A  D  F 8 C 
  1     5DEG  7 
 1 6 3 7   DE   
D   1  42  C    
5 9A F    B   67
 F      E  5 1  `.split("\n").map(r => r.split(''));
