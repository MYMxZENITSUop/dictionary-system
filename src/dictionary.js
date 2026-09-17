const Trie = require("./trie");

class Dictionary {
    constructor() {
        // Stores complete word records
        // word -> { id, word, meaning }
        this.words = new Map();

        // Trie for prefix-based autocomplete
        this.trie = new Trie();

        // Simple ID generator
        this.nextId = 1;
    }

    addWord(word, meaning) {

        word = word.trim().toLowerCase();
        meaning = meaning.trim();

        if (!word || !meaning) {
            return null;
        }

        // Prevent duplicate words
        if (this.words.has(word)) {
            return false;
        }

        const wordData = {
            id: this.nextId++,
            word: word,
            meaning: meaning
        };

        // Store in Map
        this.words.set(word, wordData);

        // Store in Trie
        this.trie.insert(word);

        return wordData;
    }

    getWord(word) {

        word = word.trim().toLowerCase();

        return this.words.get(word) || null;
    }

    getSuggestions(prefix, limit = 10) {

        prefix = prefix.trim().toLowerCase();

        const words = this.trie.getSuggestions(
            prefix,
            limit
        );

        return words.map(
            word => this.words.get(word)
        );
    }

    getAllWords() {
        return Array.from(this.words.values());
    }

    updateWord(word, meaning) {

        word = word.trim().toLowerCase();
        meaning = meaning.trim();

        const existingWord = this.words.get(word);

        if (!existingWord || !meaning) {
            return null;
        }

        existingWord.meaning = meaning;

        this.words.set(word, existingWord);

        return existingWord;
    }

    deleteWord(word) {

        word = word.trim().toLowerCase();

        if (!this.words.has(word)) {
            return false;
        }

        // Delete from Map
        this.words.delete(word);

        // Delete from Trie
        this.trie.delete(word);

        return true;
    }
}

module.exports = Dictionary;