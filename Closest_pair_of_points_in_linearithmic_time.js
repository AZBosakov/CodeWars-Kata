'use strict';

const closestPair = (() => {
    const BRUTE_FORCE_MAX = 3;
    const x = 0;
    const y = 1;
    
    const d = (p1, p2) => Math.sqrt((p1[x] - p2[x])**2 + (p1[y] - p2[y])**2);
    
    const bForce = ps => {
    }
    
    const merge = (left, right, delta) => {
        
    }
    
    return points => {
        if (points.length < 2) throw new Error("No points to compare");
        const sortX = points.slice().sort((a, b) => a[x] - b[x]);
        
        
    }
})();