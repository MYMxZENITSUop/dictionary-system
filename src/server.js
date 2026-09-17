const http = require("http");
const Dictionary = require("./dictionary");
const sampleWords = require("./data");

const PORT = 3002;

const dictionary = new Dictionary();

// Load sample dictionary data
for (const item of sampleWords) {
    dictionary.addWord(item.word, item.meaning);
}

const server = http.createServer((req, res) => {

    // Set JSON response header
    res.setHeader("Content-Type", "application/json");


    // ==========================================
    // GET /
    // Check if server is running
    // ==========================================

    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200);

        res.end(
            JSON.stringify({
                message: "Dictionary API is running"
            })
        );

        return;
    }


    // ==========================================
    // POST /words
    // Add a new word
    // ==========================================

    if (req.method === "POST" && req.url === "/words") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const data = JSON.parse(body);

                const { word, meaning } = data;

                if (!word || !meaning) {
                    res.writeHead(400);

                    res.end(
                        JSON.stringify({
                            error: "Word and meaning are required"
                        })
                    );

                    return;
                }

                const result = dictionary.addWord(
                    word,
                    meaning
                );

                if (!result) {
                    res.writeHead(409);

                    res.end(
                        JSON.stringify({
                            error: "Word already exists"
                        })
                    );

                    return;
                }

                res.writeHead(201);

                res.end(
                    JSON.stringify({
                        message: "Word added successfully",
                        data: result
                    })
                );

            } catch (error) {

                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        error: "Invalid JSON"
                    })
                );
            }
        });

        return;
    }


    // ==========================================
    // GET /words
    // Get all words
    // ==========================================

    if (req.method === "GET" && req.url === "/words") {

        const words = dictionary.getAllWords();

        res.writeHead(200);

        res.end(
            JSON.stringify({
                count: words.length,
                data: words
            })
        );

        return;
    }


    // ==========================================
    // GET /suggestions?prefix=app&limit=10
    // Prefix-based autocomplete
    // ==========================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/suggestions")
    ) {

        const url = new URL(
            req.url,
            `http://localhost:${PORT}`
        );

        const prefix = url.searchParams.get("prefix");

        // Prefix is required
        if (!prefix || !prefix.trim()) {
            res.writeHead(400);

            res.end(
                JSON.stringify({
                    error: "Prefix is required"
                })
            );

            return;
        }

        // Read limit from query parameter
        const requestedLimit =
            Number(url.searchParams.get("limit")) || 10;

        // Keep limit between 1 and 50
        const limit = Math.min(
            Math.max(requestedLimit, 1),
            50
        );

        // Get suggestions from Dictionary
        const suggestions = dictionary.getSuggestions(
            prefix,
            limit
        );

        res.writeHead(200);

        res.end(
            JSON.stringify({
                prefix: prefix.trim().toLowerCase(),
                count: suggestions.length,
                data: suggestions
            })
        );

        return;
    }


    // ==========================================
    // PUT /words/:word
    // Update a word's meaning
    // ==========================================

    if (
        req.method === "PUT" &&
        req.url.startsWith("/words/")
    ) {

        const word = decodeURIComponent(
            req.url.split("/")[2]
        );

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {
                const data = JSON.parse(body);

                const { meaning } = data;

                if (!meaning) {
                    res.writeHead(400);

                    res.end(
                        JSON.stringify({
                            error: "Meaning is required"
                        })
                    );

                    return;
                }

                const result = dictionary.updateWord(
                    word,
                    meaning
                );

                if (!result) {
                    res.writeHead(404);

                    res.end(
                        JSON.stringify({
                            error: "Word not found"
                        })
                    );

                    return;
                }

                res.writeHead(200);

                res.end(
                    JSON.stringify({
                        message: "Word updated successfully",
                        data: result
                    })
                );

            } catch (error) {

                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        error: "Invalid JSON"
                    })
                );
            }
        });

        return;
    }


    // ==========================================
    // DELETE /words/:word
    // Delete a word
    // ==========================================

    if (
        req.method === "DELETE" &&
        req.url.startsWith("/words/")
    ) {

        const word = decodeURIComponent(
            req.url.split("/")[2]
        );

        const result = dictionary.deleteWord(word);

        if (!result) {
            res.writeHead(404);

            res.end(
                JSON.stringify({
                    error: "Word not found"
                })
            );

            return;
        }

        res.writeHead(200);

        res.end(
            JSON.stringify({
                message: "Word deleted successfully"
            })
        );

        return;
    }


    // ==========================================
    // GET /words/:word
    // Get a specific word
    // ==========================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/words/")
    ) {

        const word = decodeURIComponent(
            req.url.split("/")[2]
        );

        const result = dictionary.getWord(word);

        if (!result) {
            res.writeHead(404);

            res.end(
                JSON.stringify({
                    error: "Word not found"
                })
            );

            return;
        }

        res.writeHead(200);

        res.end(
            JSON.stringify({
                data: result
            })
        );

        return;
    }


    // ==========================================
    // Route not found
    // ==========================================

    res.writeHead(404);

    res.end(
        JSON.stringify({
            error: "Route not found"
        })
    );
});


server.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});