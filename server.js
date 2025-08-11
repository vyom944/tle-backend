const express = require("express");
const fetch = require("node-fetch"); // Install with: npm install node-fetch

const app = express();
const PORT = process.env.PORT || 5000;

// Root route
app.get("/", (req, res) => {
    res.send("TLE Backend is running 🚀");
});

// TLE route
app.get("/tle", async (req, res) => {
    try {
        const url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error fetching TLE: ${response.statusText}`);

        const tleData = await response.text(); // Celestrak sends plain text
        res.type("text/plain").send(tleData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

