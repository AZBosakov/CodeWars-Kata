function anagrams(word, words) {
    const normalized = word.split('').sort().join('');
    return words.reduce((acc, w) => {
        if (w.split('').sort().join('') == normalized) acc.push(w);
        return acc;
    }, []);
}