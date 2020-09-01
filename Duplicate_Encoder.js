function duplicateEncode(word) {
    // Ignore case
    word = word.toLowerCase();
    
    const charCounts = {};
    for (let ch of word) {
        charCounts[ch] = charCounts[ch] || 0;
        charCounts[ch]++;
    }
    const encoded = [];
    for (let ch of word) {
        encoded.push(charCounts[ch] > 1 ? ')' : '(');
    }
    return encoded.join('');
}
