function solution(number){
    if (number < 0) return 0;
    let sum = 0;
    for (let n = 0; n < number; n++) {
        if (0 == n % 3 || 0 == n % 5) sum += n;
    }
    return sum;
}