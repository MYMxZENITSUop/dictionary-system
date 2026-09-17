const Trie = require("./trie");

class Dictionary {
    constructor() {
        // Primary storage:
        // word -> { id, word, frequency }
        this.words = new Map();

        // Prefix-search index
        this.trie = new Trie();

        // Generates unique IDs
        this.nextId = 1;
    }

    // Normalize input words
    normalizeWord(word) {
        return word.trim().toLowerCase();
    }

    // Add a new word
    addWord(word) {
        word = this.normalizeWord(word);

        if (!word) {
            return null;
        }

        // Word already exists
        if (this.words.has(word)) {
            return "already exists";
        }

        const wordData = {
            id: this.nextId++,
            word: word,
            frequency: 1
        };

        // Store in Map
        this.words.set(word, wordData);

        // Store in Trie
        this.trie.insert(word);

        return wordData;
    }

    // Search for an exact word
    searchWord(word) {
        word = this.normalizeWord(word);

        const wordData = this.words.get(word);

        if (!wordData) {
            return "NOT FOUND";
        }

        // Increase frequency because the word was searched
        wordData.frequency++;

        return "FOUND";
    }

    // Get prefix-based suggestions
    getSuggestions(prefix, k) {
        prefix = this.normalizeWord(prefix);

        if (!prefix) {
            return [];
        }

        // Get all matching words from Trie
        const matchingWords =
            this.trie.getWordsWithPrefix(prefix);

        // Convert words into complete records
        const suggestions = matchingWords.map(
            word => this.words.get(word)
        );

        // Sort by:
        // 1. Higher frequency first
        // 2. Alphabetical order when frequency is equal
        suggestions.sort((a, b) => {
            if (a.frequency !== b.frequency) {
                return b.frequency - a.frequency;
            }

            return a.word.localeCompare(b.word);
        });

        // Return at most k suggestions
        return suggestions.slice(0, k);
    }

    // Get all words
    getAllWords() {
        return Array.from(this.words.values());
    }

    // Delete a word
    deleteWord(word) {
        word = this.normalizeWord(word);

        if (!this.words.has(word)) {
            return false;
        }

        this.words.delete(word);
        this.trie.delete(word);

        return true;
    }
}

module.exports = Dictionary;