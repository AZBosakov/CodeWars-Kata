const bits = '0000000011011010011100000110000001111110100111110011111100000000000111011111111011111011111000000101100011111100000111110011101100000100000'.match(/^0*((1.*?)?)0*$/)[1];

// pause lengths to frequency
let pauses = Object.entries(
    bits.match(/0+/g).map(e => e.length).reduce((acc, e) => {
        acc[e] = (acc[e] || 0) + 1;
        return acc;
    }, {})
).sort(([a], [b]) => a - b);
// const pauseMin = pauses.findIndex(e => !!e);
// const pauseMax = pauses.length;
// init the cutoff for the 
// const pauseCut = [pauseMin, pauseMin+1, pauseMax-1, pauseMax];