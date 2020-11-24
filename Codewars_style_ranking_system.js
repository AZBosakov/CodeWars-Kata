const User = (() => {
    const RANKS = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];
    const MAX_LEVEL = RANKS.length - 1;
    const SCORE_PER_LEVEL = 100;
    const RANK_LEVEL = new Map(RANKS.map((e, i) => [e, i]));
    
    const newScore = (curScore, chaRank) => {
        const chaLevel = RANK_LEVEL.get(chaRank|0);
        if (undefined === chaLevel) {
            throw new Error(`Invalid rank: ${chaRank}`);
        }
        const curlevel = (curScore / SCORE_PER_LEVEL)|0;
        const diff = Math.max(chaLevel - curlevel, -2);
        switch (diff) {
            case -2: return curScore;
            case -1: return curScore + 1;
            case 0: return curScore + 3;
            default: return curScore + 10 * diff**2;
        }
    }
    
    return function () {
        var score = 0;
        var level = 0;
        
        this.incProgress = chaRank => {
            score = newScore(score, chaRank);
            level = Math.min(score / SCORE_PER_LEVEL, MAX_LEVEL)|0;
        }
        
        Object.defineProperties(
            this,
            {
                rank: {
                    get: () => RANKS[level],
                },
                progress: {
                    get: () => score - level * SCORE_PER_LEVEL,
                },
            }
        );
        
        Object.freeze(this);
    }
})();
