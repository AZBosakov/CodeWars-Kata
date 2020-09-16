/**
 * Calculate next lexicographic permutation
 * 
 * @param array arr - Elements must have a defined '<' relation
 * @return array|false - The next permutation or false if the passed one is the last.
 */
const permuteNextLO = arr => {
    const p = [...arr];
    let s0 = -1;
    let s1 = -1;
    for (let i = p.length; i--;) {
        if (p[i - 1] < p[i]) {
            s0 = i - 1;
            break;
        }
    }
    if (!~s0) return false;
    for (let i = p.length; i--;) {
        if (p[s0] < p[i]) {
            s1 = i;
            break;
        }
    }
    [p[s0], p[s1]] = [p[s1], p[s0]];
    return p.slice(0, s0 + 1).concat(p.slice(s0 + 1).reverse());
}

// Kata test function
const permutations = string => {
    let p = string.split('').sort();
    const perms = [p.join('')];
    while (p = permuteNextLO(p)) perms.push(p.join(''));
    return perms;
}