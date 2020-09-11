
const permutationGenerator = function(arr) {
    // INIT {
    const sorted = [...arr].sort();
    /**
     * Associate a consequtive number with each distinct element (0-based).
     * Duplicate elements map to the same number (the array index).
     * This way, the algo always works on numbers in range 0..num_dist-1
     */
    const eIdx = sorted.reduce((acc, e, i, arr) => {
        if (e != arr[i - 1]) acc.push(e);
        return acc;
    }, []);
    // Init the first perm. with the indexes of the element
    const current = sorted.reduce((acc, e, i, arr) => {
        if (i) {
            e == arr[i - 1] ? acc.push(acc[i - 1]) : acc.push(acc[i - 1] + 1);
        } else {
            acc.push(0);
        }
        return acc;
    }, []);
    // Bits Per Int
    const BPI = 32;
    // Bitfield of directions 0:<, 1:>
    const dir = new Uint32Array(Math.ceil(eIdx.length / BPI))
    // map index to element
    const idx2el = idx => eIdx[idx];
    // } INIT
    
    console.table(sorted.map((e,i) => ([ e, current[i], eIdx[current[i]] ])));
    
    
}


const permutations = string => {
    
    
}