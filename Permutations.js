
const permutationGenerator = function(arr) {
    if (arr.length < 2) return arr;
    // INIT {
    const preSort = [...arr].sort();
    /**
     * Normalization:
     * Associate a consequtive number with each distinct element (0-based).
     * Duplicate elements map to the same number (the array index of eIdx[]).
     * This way, the algo always operates on numbers in range 0..num_dist-1
     * Numbers are assigned in the order of occurence, hence the preSort,
     * to make numbers increase with the lexicographic order, if any.
     */
    const els = new Map();
    preSort.forEach(e => els.set(e, true));
    // [els.el.0, els.el.1, ...] : maps number => element
    const eIdx = [...els.entries()].map(e => e[0]);
    // Reverse mapping: element => number
    eIdx.forEach((e, i) => els.set(e, i));
    /**
     * Init the first lex. permutation.
     * Now sorted by the corresponding numbers.
     * Handles cases where .sort() doesn't work, eg.:
     * o0 = {p:0}; o1 = {p:1}; o2 = {p:2}; inpArr = [o0, o1, o0, o2, o1];
     * .sort() won't change it to [o0, o0, o1, o1, o2],
     * but after mapping it to [0, 1, 0, 2, 1], it can be sorted
     */
    const current = preSort.map(e => els.get(e)).sort((a, b) => a - b);
    
    
    
    // BitWidth
    const BW = 32;
    // Bitfield of directions 0:<, 1:>
    const dir = new Uint32Array(Math.ceil(eIdx.length / BW))
    // map index to element
    const idx2el = idx => eIdx[idx];
    // } INIT
    
    console.table(current.map(e => ([eIdx[e], e])));
    
    
}


const permutations = string => {
    
    
}