const User = (() => {
    const RANKS = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];
    const SCORE_PER_LEVEL = 100;
    const MAX_LEVEL = RANKS.length - 1;
    const MAX_SCORE = MAX_LEVEL * SCORE_PER_LEVEL;
    const RANK_LEVEL = new Map(RANKS.map((e, i) => [e, i]));
    
    const newScore = (curScore, chaRank) => {
        const chaLevel = RANK_LEVEL.get(chaRank|0);
        if (undefined === chaLevel) {
            throw new Error(`Invalid rank: ${chaRank}`);
        }
        const curLevel = (curScore / SCORE_PER_LEVEL)|0;
        const diff = Math.max(chaLevel - curLevel, -2);
        
        let adjust;
        switch (diff) {
            case -2:
                adjust = 0
                break;
            case -1:
                adjust = 1;
                break;
            case 0:
                adjust = 3;
                break;
            default:
                adjust = 10 * diff**2;
        }
        return Math.min(MAX_SCORE, curScore + adjust);
    }
    
    return function () {
        var score = 0;
        
        this.incProgress = chaRank => score = newScore(score, chaRank);
        
        Object.defineProperties(
            this,
            {
                rank: {
                    get: () => RANKS[(score / SCORE_PER_LEVEL)|0],
                    enumerable: true,
                },
                progress: {
                    get: () => score % SCORE_PER_LEVEL,
                    enumerable: true,
                },
            }
        );
        
        Object.freeze(this);
    }
})();
