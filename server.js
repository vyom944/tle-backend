const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());

// Store data in memory
let tleData = null;
let lastUpdated = null;

// Function to fetch TLE data from CelesTrak
async function fetchTLEData() {
  try {
    console.log("Fetching updated TLE data from CelesTrak...");
    const response = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    tleData = await response.text();
    lastUpdated = new Date();
    console.log("TLE data updated at", lastUpdated.toLocaleTimeString());
  } catch (error) {
    console.error("Error fetching TLE data:", error);
  }
}

// Initial fetch
fetchTLEData();

// Update every 10 minutes
setInterval(fetchTLEData, 10 * 60 * 1000);

// API endpoint
app.get("/tle", (req, res) => {
  if (tleData) {
    res.send({
      lastUpdated,
      data: tleData
    });
  } else {
    res.status(503).send({ error: "TLE data not available yet. Try again in a few seconds." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
