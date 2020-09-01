function iqTest(numbers){
    const integers = numbers.trim().split(/\s+/);
    const arrayParity = (
        (integers[0] & 1) + (integers[1] & 1) + (integers[2] & 1)
    ) >> 1;
    for (let i = 0; i < integers.length; i++) {
        if ((integers[i] & 1) != arrayParity) return i+1;
    }
}