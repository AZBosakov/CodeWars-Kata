'use strict';

const closestPair = (() => {
    // Normalize Index
    const ni = (i, l) => i < 0 ? Math.max(0, (i|0) + l) : Math.min(l, (i|0));
    /*
     * Avoid copying the array via .slice(),
     * when creating Left and Right parts.
     */
    class ArrayRange {
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
    const X = 0;
    const Y = 1;
    
    /**
     * @param p0 [x, y]
     * @param p1 [x, y]
     * @return float
     */ 
    const dist = (p0, p1) => Math.sqrt((p0[X] - p1[X])**2 + (p0[Y] - p1[Y])**2);
    const sortByX = (p0, p1) => p0[X] - p1[X];
    const sortByY = (p0, p1) => p0[Y] - p1[Y];
    
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
    
    const L = 0;
    const R = 1;
    
    /**
     * @param psr ArrayRange
     * @return {p0, p1, d}
     */
    const search = psr => {
        if (psr.length < BRUTE_FORCE) return bForce(psr);
        const cut = psr.length / 2;
        
        const rL = psr.slice(0, cut);
        const rR = psr.slice(cut);
        
        const cL = search(rL);
        const cR = search(rR);
        
        const closer = cL.d <= cR.d ? cL : cR;
        
        let d = closer.d;
        // Ranges are from array sorted by X-coord
        const sL = rR.item(0)[X] - d;
        const sR = rL.item(-1)[X] + d;
        
        const inStrip = [];
        let p;
        
        let i = rL.length;
        while (--i > -1 && (p = rL.item(i))[X] >= sL) inStrip.push(p);
                     
        i = -1;
        while (++i < rR.length && (p = rR.item(i))[X] <= sR) inStrip.push(p);
        
        inStrip.sort(sortByY);
        let p0, p1;
        for (let j = 1; j < inStrip.length; j++) {
            const i = j - 1;
            const newMin = dist(inStrip[i], inStrip[j])
            if (newMin < d) {
                d = newMin;
                p0 = inStrip[i];
                p1 = inStrip[j];
            }
        }
        return p0 ? {p0, p1, d} : closer;
    }
    
    return points => {
        if (points.length < 2) throw new Error("No points to compare");
        // Copy & sort-by-X
        const psByX = new ArrayRange(
            points.map(([...c]) => c).sort(sortByX)
        );
        
        const {p0, p1} = search(psByX);
        return [p0, p1];
    }
})();