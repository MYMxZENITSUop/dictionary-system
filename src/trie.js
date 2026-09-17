class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let currentNode = this.root;

        for (const char of word) {
            if (!currentNode.children.has(char)) {
                currentNode.children.set(char, new TrieNode());
            }

            currentNode = currentNode.children.get(char);
        }

        currentNode.isEndOfWord = true;
    }

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

    getSuggestions(prefix, limit = 10) {
        let currentNode = this.root;

        // Find the node corresponding to the prefix
        for (const char of prefix) {
            if (!currentNode.children.has(char)) {
                return [];
            }

            currentNode = currentNode.children.get(char);
        }

        const suggestions = [];

        // Collect words below the prefix node
        this.collectWords(
            currentNode,
            prefix,
            suggestions,
            limit
        );

        return suggestions;
    }

    collectWords(node, currentWord, suggestions, limit) {

        // Stop once we have enough suggestions
        if (suggestions.length >= limit) {
            return;
        }

        if (node.isEndOfWord) {
            suggestions.push(currentWord);
        }

        for (const [char, childNode] of node.children) {

            if (suggestions.length >= limit) {
                break;
            }

            this.collectWords(
                childNode,
                currentWord + char,
                suggestions,
                limit
            );
        }
    }

    delete(word) {
        const deleteRecursive = (node, index) => {

            // Reached the end of the word
            if (index === word.length) {

                if (!node.isEndOfWord) {
                    return false;
                }

                node.isEndOfWord = false;

                return node.children.size === 0;
            }

            const char = word[index];
            const childNode = node.children.get(char);

            // Word does not exist
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