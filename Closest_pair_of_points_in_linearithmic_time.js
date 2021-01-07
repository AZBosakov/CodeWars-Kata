
const closestPair = (() => {
    const BRUTE_FORCE_MAX = 3;
    const x = 0;
    const y = 1;
    
    const d = (p1, p2) => Math.sqrt((p1[x] - p2[x])**2 + (p1[y] - p2[y])**2);
    
    const bForce = ps => {
        const l = ps.length;
        let min = Infinity;
        const points = [];
        for (let i = 0; i < l-1; i++) {
            for (let j = i+1; j < l; j++) {
                const nMin = d(ps[i], ps[j]);
                if (nMin < min) {
                    min = nMin;
                    points[0] = ps[i];
                    points[1] = ps[j];
                }
            }
        }
        return {points, d: min};
    }
    
    const merge = (left, right, delta) => {
        
    }
    
    return points => {
        if (points.length < 2) throw new Error("No points to compare");
        const sortX = points.slice().sort((a, b) => a[x] - b[x]);
        
        
    }
})();