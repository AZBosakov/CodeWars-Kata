/**
 * Create the parseInt() function for the corresponding scale:
 * https://en.wikipedia.org/wiki/Names_of_large_numbers
 * 
 * @param bool shortScale - the names of the powers of 10 to use
 * @return function - the integer description parser
 */
const parserCreator = (shortScale = true) => {
    // Token types {
    const T_START   = 1 << 0; // RIGHT end of the descr.
    const T_ZERO    = 1 << 1; // 'zero' : 0
    const T_DIGIT   = 1 << 2; // 1..9
    const T_TEEN    = 1 << 3; // 10..19
    const T_TENS    = 1 << 4; // 20, 30, ... 90
    const T_AND     = 1 << 5; // 'and' - ignore
    const T_HUNDRED = 1 << 6; // 'hundred'
    const T_10E3N   = 1 << 7; // 'thousand': 10**(3*1), 'million': 10**(3*2), ...
    const T_MINUS   = 1 << 8; // 'minus'
    
    const T_STOP    = 1 << 31; // null
    // } Token types
    
    // START from the RIGT to LEFT - smallest to biggest; FOLLOWs to the LEFT!
    const following = {
        [T_START]:      T_ZERO | T_DIGIT | T_TEEN | T_TENS | T_HUNDRED | T_10E3N,
        [T_ZERO]:       T_STOP,
        [T_DIGIT]:      T_TENS | T_AND | T_HUNDRED | T_10E3N | T_MINUS | T_STOP,
        [T_TEEN]:       T_AND | T_HUNDRED | T_10E3N | T_MINUS | T_STOP,
        [T_TENS]:       T_AND | T_HUNDRED | T_10E3N | T_MINUS | T_STOP,
        [T_AND]:        T_HUNDRED | T_10E3N,
        [T_HUNDRED]:    T_DIGIT,
        [T_10E3N]:      T_DIGIT | T_TEEN | T_TENS | T_HUNDRED,
        [T_MINUS]:      T_STOP,

        [T_STOP]: 0,
    };
    // 'token_name' => {type: T_..., value: ...}
    const tokens = new Map();
    (() => {
        // token creator helper, in the closure
        const $ = (type, value) => ({type, value});
        // T_START
        tokens.set(-1, $(T_START, 0));
        // T_ZERO
        tokens.set('zero', $(T_ZERO, 0));
        // T_DIGIT
        'one two three four five six seven eight nine'
            .split(/\W+/).forEach((t, i) => tokens.set(t, $(T_DIGIT, i+1)));
        // T_TEEN
        `ten eleven twelve thirteen fourteen
        fifteen sixteen seventeen eighteen nineteen`
            .split(/\W+/).forEach((t, i) => tokens.set(t, $(T_TEEN, i+10)));
        // T_TENS
        `twenty thirty forty fifty sixty seventy eighty ninety`
            .split(/\W+/).forEach((t, i) => tokens.set(t, $(T_TENS, (i+2)*10)));
        // T_AND
        tokens.set('and', $(T_AND, 0));
        // T_HUNDRED
        tokens.set('hundred', $(T_HUNDRED, 100));
        // T_10E3N
        // Up to 'trillion', both scales are 3n degs. of 10 step
        // The value for the token is the degree of 10 / 3
        ('thousand million ' +
            (shortScale ? 'billion' : 'milliard billion billiard') + 
        ' trillion').split(/\W+/).forEach((t, i) => tokens.set(t, $(T_10E3N, i+1)));
        // After 'trillion' long scale is with step 6 -> 2*n
        const mul = shortScale ? 1 : 2;
        const offset = shortScale ? 5 : 8;
        `quadrillion quintillion sextillion septillion octillion nonillion
        decillion undecillion duodecillion tredecillion quattuordecillion quindecillion
        sexdecillion septendecillion octodecillion novemdecillion vigintillion`
            .split(/\W+/).forEach((t, i) => tokens.set(t, $(T_10E3N, (i*mul)+offset)));
        // T_MINUS
        tokens.set('minus', $(T_MINUS, -1));
        // T_STOP
        tokens.set(null, $(T_STOP, 0));
    })();
    
    return tokens; // TESTING
    
    // The parse function
//     return string => {
//         string = string.toLowerCase();
//         // Filter non-words at the begining/end if any, split the words,
//         const tokens = string.match(/\W*([a-z ]*)/)[1].trim().split(/\W+/)
//             // normalize the plurals (thousandS -> thousand), and REVERSE
//             .map(e => e.match(/^(.*?)s?$/)[1]).reverse(); // Parse from smallest to biggest
//             .push(null); // add a T_STOP at the end
//         
//         let curToken = tokens.get(-1);
//         
//     }
}