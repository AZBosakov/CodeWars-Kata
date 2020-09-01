function findOutlier(integers){
  //your code here
    const arrayParity = (
        (integers[0] & 1) + (integers[1] & 1) + (integers[2] & 1)
    ) >> 1;
    for (let i = 0; i < integers.length; i++) {
        if ((integers[i] & 1) != arrayParity) return integers[i];
    }
}