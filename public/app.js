const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResult = document.getElementById("searchResult");

const prefixInput = document.getElementById("prefixInput");
const kInput = document.getElementById("kInput");
const suggestions = document.getElementById("suggestions");

const wordInput = document.getElementById("wordInput");
const addButton = document.getElementById("addButton");
const addResult = document.getElementById("addResult");


// ==========================================
// Search Word
// ==========================================

async function searchWord() {
    const word = searchInput.value.trim();

    if (!word) {
        searchResult.textContent = "Please enter a word.";
        return;
    }

    try {
        const response = await fetch(
            `/search?word=${encodeURIComponent(word)}`
        );

        const data = await response.json();

        searchResult.textContent = data.result;

    } catch (error) {
        searchResult.textContent = "Something went wrong.";
    }
}

searchButton.addEventListener("click", searchWord);


// Allow pressing Enter to search

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchWord();
    }
});


// ==========================================
// Prefix Suggestions
// ==========================================

async function getSuggestions() {
    const prefix = prefixInput.value.trim();
    const k = Number(kInput.value);

    suggestions.innerHTML = "";

    if (!prefix) {
        return;
    }

    if (!Number.isInteger(k) || k <= 0) {
        suggestions.innerHTML =
            '<p class="no-results">Enter a valid number of suggestions.</p>';

        return;
    }

    try {
        const response = await fetch(
            `/suggestions?prefix=${encodeURIComponent(prefix)}&k=${k}`
        );

        const data = await response.json();

        if (data.data.length === 0) {
            suggestions.innerHTML =
                '<p class="no-results">No matching words found.</p>';

            return;
        }

        data.data.forEach(word => {
            const suggestion = document.createElement("div");

            suggestion.className = "suggestion";
            suggestion.textContent = word;

            suggestions.appendChild(suggestion);
        });

    } catch (error) {
        suggestions.innerHTML =
            '<p class="no-results">Something went wrong.</p>';
    }
}


// Get suggestions while typing

prefixInput.addEventListener("input", getSuggestions);


// Update suggestions when k changes

kInput.addEventListener("input", getSuggestions);


// ==========================================
// Add Word
// ==========================================

async function addWord() {
    const word = wordInput.value.trim();

    if (!word) {
        addResult.textContent = "Please enter a word.";
        return;
    }

    try {
        const response = await fetch("/words", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                word: word
            })
        });

        const data = await response.json();

        if (response.status === 409) {
            addResult.textContent = "already exists";
            return;
        }

        if (!response.ok) {
            addResult.textContent =
                data.error || "Something went wrong.";

            return;
        }

        addResult.textContent = "Word added successfully.";

        wordInput.value = "";

    } catch (error) {
        addResult.textContent = "Something went wrong.";
    }
}

addButton.addEventListener("click", addWord);


// Allow pressing Enter to add a word

wordInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addWord();
    }
});