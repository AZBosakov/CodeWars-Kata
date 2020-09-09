

const permutations = string => {
    const sorted = string.split('').sort();
    // associate a number with each distinct char
    const num2char = sorted.reduce((acc, e, i, arr) => {
        if (e != arr[i - 1]) acc.push(e);
        return acc;
    }, []);
    // convert the char seq. to a numeric one
    const nums = sorted.reduce((acc, e, i, arr) => {
        if (i) {
            e == arr[i - 1] ? acc.push(acc[i - 1]) : acc.push(acc[i - 1] + 1);
        } else {
            acc.push(0);
        }
        return acc;
    }, []);
    
    
}