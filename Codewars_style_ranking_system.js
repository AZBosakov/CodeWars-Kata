const User = (() => {
    const RANKS = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];
    const LEVEL_UP = 100;
    const RANK_LEVEL = new Map(RANKS.map((e, i) => [e, i]));
    
    const newScore = (curScore, chRank) => {
        const chLevel = RANK_LEVEL.get(chRank|0);
        if (undefined === chLevel) {
            throw new Error(`Invalid rank: ${chRank}`);
        }
        const curlevel = (curScore / LEVEL_UP)|0;
        const diff = Math.max(chLevel - curlevel, -2);
        switch (diff) {
            case -2: return curScore;
            case -1: return curScore + 1;
            case 0: return curScore + 3;
            default: return curScore + 10 * diff**2;
        }
    }
    
    return function {
        var score = 0;
        
        
    }
})();
