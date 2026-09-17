# Dictionary Autocomplete System

This project implements a simple dictionary system with word search, prefix-based suggestions, and word insertion using plain Node.js.

## 1. Data Structures Used

### Map

A JavaScript `Map` is used to store the dictionary words.

Each word is stored with its ID, word, and search frequency.

Example:

```text
"apple" -> {
    id: 1,
    word: "apple",
    frequency: 3
}
```

The Map is useful for exact word lookup because a word can be accessed directly using its key.

Map lookup and insertion are O(1) on average.

### Trie

A Trie is used for prefix-based suggestions.

Words are stored character by character in the Trie. Words with the same prefix share the same nodes.

For example:

```text
apple
apply
application
```

All three words share the prefix:

```text
app
```

The Trie allows the system to find words related to a prefix without checking every word in the dictionary.

Each Trie node contains:

```text
children
isEndOfWord
word
```

The Trie supports insertion, searching, prefix traversal, and deletion.

---

## 2. Logic and Approach

The system uses the Map and Trie together because they are useful for different operations.

### Adding a Word

When a new word is added:

1. The word is trimmed and converted to lowercase.
2. The Map is checked to see if the word already exists.
3. If it exists, the system returns `already exists`.
4. Otherwise, a new record is created with frequency set to `1`.
5. The word is added to the Map.
6. The word is inserted into the Trie.

Example:

```text
add("apple")

apple -> {
    id: 1,
    word: "apple",
    frequency: 1
}
```

### Searching for a Word

For an exact search, the Map is used.

If the word does not exist:

```text
NOT FOUND
```

If the word exists:

```text
FOUND
```

Its frequency is also increased by `1` because the word was searched.

For example:

```text
Before search:

apple -> frequency: 2
```

After searching for `apple`:

```text
apple -> frequency: 3
```

The search operation returns only `FOUND` or `NOT FOUND`.

### Prefix Suggestions

For a request such as:

```text
suggest("app", 3)
```

the system first uses the Trie to find the node corresponding to `app`.

It then collects the words below that node and gets their records from the Map.

The suggestions are sorted using these rules:

1. Higher frequency comes first.
2. If frequencies are equal, words are sorted alphabetically.
3. Only the first `k` results are returned.
4. If no words match the prefix, an empty list is returned.

The basic flow is:

```text
Prefix
   |
   v
 Trie
   |
   v
Matching words
   |
   v
 Map records
   |
   v
Sort by frequency
   |
   v
Alphabetical order for ties
   |
   v
Return first k words
```

### Complexity

Let:

- `L` = length of a word
- `P` = length of the prefix
- `M` = number of words matching the prefix

```text
Add Word:
Map insert       -> O(1) average
Trie insert      -> O(L)

Search:
Map lookup       -> O(1) average

Suggestions:
Find prefix      -> O(P)
Collect matches  -> O(M)
Sort matches     -> O(M log M)
```

The Trie prevents the system from having to scan the complete dictionary just to find words matching a prefix.

---

## 3. How to Run and Test

### Requirements

- Node.js
- npm

No external framework or library is used.

### Run the Project

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd dictionary-system
```

Install the project:

```bash
npm install
```

Start the server:

```bash
npm start
```

The server runs on:

```text
http://localhost:3002
```

### Test the APIs

The APIs can be tested using Thunder Client, Postman, or another HTTP client.

### Search a Word

Request:

```http
GET http://localhost:3002/search?word=apple
```

Expected response:

```json
{
    "result": "FOUND"
}
```

Search for a word that does not exist:

```http
GET http://localhost:3002/search?word=xyz
```

Expected response:

```json
{
    "result": "NOT FOUND"
}
```

### Add a Word

Request:

```http
POST http://localhost:3002/words
```

Request body:

```json
{
    "word": "apricot"
}
```

A newly added word starts with frequency `1`.

Adding the same word again returns:

```json
{
    "message": "already exists"
}
```

### Get Suggestions

Request:

```http
GET http://localhost:3002/suggestions?prefix=app&k=3
```

The response contains at most `3` words matching the prefix.

Example:

```json
{
    "data": [
        "apple",
        "application",
        "appetite"
    ]
}
```

The actual order depends on the search frequencies.

### View Current Words

Request:

```http
GET http://localhost:3002/words
```

This can be used to check the current words and their frequency values while testing.

---

## 4. Technical Assumptions and Details

- Words are treated as case-insensitive.
- Leading and trailing spaces are removed before processing.
- New words start with a frequency of `1`.
- Adding an existing word does not increase its frequency.
- Frequency is increased only when an existing word is successfully searched.
- Search returns only `FOUND` or `NOT FOUND`.
- Suggestions contain only words that start with the requested prefix.
- Suggestions are sorted by frequency in descending order.
- Words with the same frequency are sorted in lexicographical order.
- The number of suggestions returned cannot be greater than `k`.
- If fewer than `k` words match, all matching words are returned.
- If no words match, an empty list is returned.
- The current implementation uses in-memory storage.
- Data added while the server is running is lost when the server restarts.
- Sample words are loaded from `src/data.js` when the server starts.
- The backend uses only Node.js built-in functionality.
- No Express or other backend framework is used.