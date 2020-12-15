
const closestPair = (() => {
    const BRUTE_FORCE = 3;
    // Skipping Math.sqrt
    const dsq = ([x1, y1], [x2, y2]) => (x1 - x2)**2 + (y1 - y2)**2;
    
    const brute = ps => {
        const l = ps.length;
        let min = Infinity;
        let p0 = 0;
        let p1 = 0;
        for (let i = 0; i < l; i++) {
            for (let j = i+1; j < l; j++) {
                const cur = dsq(ps[i], ps]j]);
                if (cur < min) {
                    min = cur;
                    p0 = i;
                    p1 = j;
                }
            }
        }
        return {points: [ps[p0], ps[p1]], dsq: min};
    }
    
    return points => {
        const psx = point.sort(([x0], [x1]) => x0 - x1);
        
        const recSearch = points => {
            if (points.length <= BRUTE_FORCE) return brute(points);
            
            
        }
        
        return recSearch().points;
    }   
})();