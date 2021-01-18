'use strict';

const closestPair = (() => {
    // Normalize Index
    const ni = (i, l) => i < 0 ? Math.max(0, (i|0) + l) : Math.min(l, (i|0));
    /*
     * Avoid copying the array via .slice(),
     * when creating Left and Right parts.
     */
    class ArrayRange = {
        constructor(arr, start = 0, end = arr.length) {
            start = ni(start, arr.length);
            end = ni(end, arr.length);
            end = Math.max(start, end);
            
            this.start = start;
            this.end = end;
            this.length = end - start;
            this.array = arr;
        }
        
        item(i) {
            if (i < 0) i+= this.length;
            if (i < 0 || i >= this.length) return undefined;
            return this.array[this.start + i];
        }
        
        slice(start = 0, end = this.length) {
            start = ni(start, this.length);
            end = ni(end, this.length);
            end = Math.max(start, end);
            return new ArrayRange(this.array, this.start + start, this.start + end);
        }
    }
    
    const BRUTE_FORCE = 4;
    const x = 0;
    const y = 1;
    
    /**
     * @param p0 [x, y]
     * @param p1 [x, y]
     * @return float
     */ 
    const dist = (p0, p1) => Math.sqrt((p0[x] - p1[x])**2 + (p0[y] - p1[y])**2);
    
    /**
     * @param psr ArrayRange
     * @return {p0, p1, d}
     */
    const bForce = psr => {
        let min = Infinity;
        let p0, p1;
        for (let i = 0; i < psr.length - 1; i++) {
            for (let j = i + 1; j < psr.length; j++) {
                const newMin = dist(psr.item(i), psr.item(j));
                if (newMin < min) {
                    min = newMin;
                    p0 = psr.item(i);
                    p1 = psr.item(j);
                }
            }
        }
        return {p0, p1, d: min};
    }
    
    /**
     * @param psr ArrayRange
     * @return {p0, p1, d}
     */
    const search = psr => {
        if (psr.length <= BRUTE_FORCE) return bForce(psr);
        
    }
    
    return points => {
        if (points.length < 2) throw new Error("No points to compare");
        // Copy & sort-by-X
        const sortX = new ArrayRange(
            points.map(([...c]) => c).sort((a, b) => a[x] - b[x])
        );
        
        const {p0, p1} = search(sortX);
        return [p0, p1];
    }
})();