
const closestPair = (() => {
    const BRUTE_FORCE = 3;
    const X = 0;
    const Y = 1;
    
    const IN_L = 0;
    const IN_R = 1;
    
    const dist = ([x0, y0], [x1, y1]) => Math.sqrt((x0 - x1)**2 + (y0 - y1)**2);
    
    const brute = ps => {
        const l = ps.length;
        let min = Infinity;
        let cl = [0, 0]
        for (let i = 0; i < l-1; i++) {
            for (let j = i+1; j < l; j++) {
                const cur = dist(ps[i], ps[j]);
                if (cur < min) {
                    min = cur;
                    cl = [i, j];
                }
            }
        }
        return {points: [ps[cl[0]], ps[cl[1]]], d: min};
    }
    
    return points => {
        const psx = points.sort(([x0], [x1]) => x0 - x1);
        
        const sortYStrip = ({point: [, y0]}, {point: [, y1]}) => y0 - y1;
        
        const recSearch = points => {
            if (points.length <= BRUTE_FORCE) return brute(points);
            
            const si = points.length / 2;
            const L = points.slice(0, si);
            const R = points.slice(si);
            
            const Lcl = recSearch(L);
            const Rcl = recSearch(R);
            
            let d = Math.min(Lcl.d, Rcl.d);
            const strip = [
                R[0][X] - d,
                L[L.length-1][X] + d,
            ];
            
            if (strip[1] < R[0][X]) {
                return Lcl.d == d ? Lcl : Rcl;
            }
            
            const inStrip = [];
            let i = L.length;
            while (
                --i > -1 &&
                L[i][X] >= strip[0]
            ) inStrip.push({point: L[i], set: IN_L});
            i = -1;
            while (
                ++i < R.length &&
                R[i][X] <= strip[1]
            ) inStrip.push({point: R[i], set: IN_R});
            
            inStrip.sort(sortYStrip);
            let prevSet = inStrip[0].set;
            const CL = {
                points: [inStrip[0].point, inStrip[1].point],
                d: d
            }
            for (let i = 1; i < inStrip.length; i++) {
                if (prevSet == inStrip[i].set) continue;
                prevSet = inStrip[i].set;
                let j = i-1;
                const d = dist(inStrip[i].point, inStrip[j].point);
                if (d >= CL.d) continue;
                CL.points = [inStrip[i].point, inStrip[j].point];
                CL.d = d;
            }
            return CL;
        }
        
        return recSearch(psx).points;
    }   
})();