// https://www.codewars.com/kata/523a86aa4230ebb5420001e1

function anagrams(word, words) {
    const normalized = word.split('').sort().join('');
    return words.reduce((acc, w) => {
        if (w.split('').sort().join('') == normalized) acc.push(w);
        return acc;
    }, []);
}