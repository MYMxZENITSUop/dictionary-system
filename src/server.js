const http = require("http");
const Dictionary = require("./dictionary");
const sampleWords = require("./data");

const PORT = 3002;

const dictionary = new Dictionary();

// Load sample words
for (const word of sampleWords) {
    dictionary.addWord(word);
}

const server = http.createServer((req, res) => {

    // JSON response
    res.setHeader("Content-Type", "application/json");

    // ==========================================
    // GET /
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
    // GET /search?word=apple
    // Search for an exact word
    // ==========================================

    if (
        req.method === "GET" &&
        req.url.startsWith("/search")
    ) {
        const url = new URL(
            req.url,
            `http://localhost:${PORT}`
        );

        const word = url.searchParams.get("word");

        if (!word || !word.trim()) {
            res.writeHead(400);

            res.end(
                JSON.stringify({
                    error: "Word is required"
                })
            );

            return;
        }

        const result = dictionary.searchWord(word);

        res.writeHead(200);

        res.end(
            JSON.stringify({
                result: result
            })
        );

        return;
    }


    // ==========================================
    // GET /suggestions?prefix=app&k=3
    // Prefix-based suggestions
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
        const requestedK = Number(
            url.searchParams.get("k")
        );

        if (!prefix || !prefix.trim()) {
            res.writeHead(400);

            res.end(
                JSON.stringify({
                    error: "Prefix is required"
                })
            );

            return;
        }

        if (
            !Number.isInteger(requestedK) ||
            requestedK <= 0
        ) {
            res.writeHead(400);

            res.end(
                JSON.stringify({
                    error: "k must be a positive integer"
                })
            );

            return;
        }

        const suggestions =
            dictionary.getSuggestions(
                prefix,
                requestedK
            );

        res.writeHead(200);

        res.end(
            JSON.stringify({
                data: suggestions.map(
                    item => item.word
                )
            })
        );

        return;
    }


    // ==========================================
    // POST /words
    // Add a new word
    // ==========================================

    if (
        req.method === "POST" &&
        req.url === "/words"
    ) {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                const { word } = data;

                if (
                    typeof word !== "string" ||
                    !word.trim()
                ) {
                    res.writeHead(400);

                    res.end(
                        JSON.stringify({
                            error: "Word is required"
                        })
                    );

                    return;
                }

                const result =
                    dictionary.addWord(word);

                if (result === "already exists") {
                    res.writeHead(409);

                    res.end(
                        JSON.stringify({
                            message: "already exists"
                        })
                    );

                    return;
                }

                res.writeHead(201);

                res.end(
                    JSON.stringify({
                        message: "added",
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

    if (
        req.method === "GET" &&
        req.url === "/words"
    ) {
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

        const result =
            dictionary.deleteWord(word);

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
                message: "deleted"
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