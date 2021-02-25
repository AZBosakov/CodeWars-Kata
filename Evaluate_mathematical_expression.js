const calc = (() => {
    // Token Types
    const [
        T_START, T_SPACE, T_NEGATE, T_NUMBER,
        T_FUNC, T_OPEN, T_CLOSE, T_END
    ] = [...Array(32).keys()].map(e => 1 << e);
    
    
    return expression => {
        const exp = expression.trim();
        
    }
})();