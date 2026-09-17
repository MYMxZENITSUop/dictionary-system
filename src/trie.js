class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.word = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert a word into the Trie
    insert(word) {
        let currentNode = this.root;

        for (const char of word) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNode());
            }

            currentNode = currentNode.children.get(char);
        }

        currentNode.isEndOfWord = true;
        currentNode.word = word;
    }

    // Check whether a complete word exists in the Trie
    search(word) {
        let currentNode = this.root;

        for (const char of word) {
            if (!currentNode.children.has(char)) {
                return false;
            }

            currentNode = currentNode.children.get(char);
        }

        return currentNode.isEndOfWord;
    }

    // Get the Trie node corresponding to a prefix
    getPrefixNode(prefix) {
        let currentNode = this.root;

        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return null;
            }

            currentNode = currentNode.children.get(char);
        }

        return currentNode;
    }

    // Collect all words below a given Trie node
    collectWords(node, words) {
        if (node.isEndOfWord) {
            words.push(node.word);
        }

        for (const childNode of node.children.values()) {
            this.collectWords(childNode, words);
        }
    }

    // Get all words that start with the given prefix
    getWordsWithPrefix(prefix) {
        const prefixNode = this.getPrefixNode(prefix);

        if (!prefixNode) {
            return [];
        }

        const words = [];

        this.collectWords(prefixNode, words);

        return words;
    }

    // Delete a word from the Trie
    delete(word) {
        const deleteRecursive = (node, index) => {
            if (index === word.length) {
                if (!node.isEndOfWord) {
                    return false;
                }

                node.isEndOfWord = false;
                node.word = null;

                return node.children.size === 0;
            }

            const char = word[index];
            const childNode = node.children.get(char);

            if (!childNode) {
                return false;
            }

            const shouldDeleteChild = deleteRecursive(
                childNode,
                index + 1
            );

            if (shouldDeleteChild) {
                node.children.delete(char);
            }

            return (
                node.children.size === 0 &&
                !node.isEndOfWord
            );
        };

        deleteRecursive(this.root, 0);
    }
}

module.exports = Trie;