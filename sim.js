const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.static('public')); // Serve static files from the "public" directory

// Variables to simulate servo movement
let angle = 0;
let direction = 1; // 1 for increasing, -1 for decreasing

// Function to simulate distance data
function calculateDistance() {
    return Math.random() * 100; // Simulate distance between 0 and 40 cm
}

app.get('/data', (req, res) => {
    // Simulate the servo moving
    if (angle >= 180) {
        direction = -1;
    } else if (angle <= 0) {
        direction = 1;
    }

    angle += direction;

    // Send the current angle and distance
    const distance = calculateDistance();
    res.send(`${Math.round(angle)},${Math.round(distance)}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
