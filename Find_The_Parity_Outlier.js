// https://www.codewars.com/kata/5526fc09a1bbd946250002dc

function findOutlier(integers){
  //your code here
    const arrayParity = (
        (integers[0] & 1) + (integers[1] & 1) + (integers[2] & 1)
    ) >> 1;
    return integers.find(e => (e & 1) != arrayParity);
}