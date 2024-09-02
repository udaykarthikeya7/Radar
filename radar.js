
const canvas = document.getElementById("radarCanvas");
const ctx = canvas.getContext("2d");

let radarRadius, centerX, centerY;

// Function to resize the canvas and redraw the radar
function resizeCanvas() {
    // Set canvas width and height based on the window size
    canvas.width = window.innerWidth * 0.8; // Adjust the width percentage as needed
    canvas.height = window.innerHeight * 0.8; // Adjust the height percentage as needed

    // Recalculate the radar properties based on the new canvas size
    radarRadius = Math.min(canvas.width, canvas.height) * 0.4;
    centerX = canvas.width / 2;
    centerY = canvas.height * 0.85;

    // Clear and redraw the radar
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRadarGrid();
}

window.addEventListener('resize', resizeCanvas);

// Initial canvas setup
resizeCanvas();

// Function to draw the radar grid
function drawRadarGrid() {
    ctx.strokeStyle = "#2364f2";
    ctx.lineWidth = 2;
    ctx.font = "16px Arial";
    ctx.fillStyle = "#2364f2";
    ctx.textAlign = "center";

    // Draw arcs and distance labels
    for (let i = 1; i <= 4; i++) {
        const radius = radarRadius * (i * 0.25);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Draw distance labels
        const labelX = centerX - radius;
        const labelY = centerY + 20;
        ctx.fillText(`${i * 10} cm`, labelX, labelY);
    }

    // Draw angle lines and angle labels
    for (let angle = 0; angle <= 180; angle += 30) {
        const radian = angle * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - radarRadius * Math.cos(radian), centerY - radarRadius * Math.sin(radian));
        ctx.stroke();

        // Draw angle labels
        const labelX = centerX - (radarRadius + 30) * Math.cos(radian);
        const labelY = centerY - (radarRadius + 30) * Math.sin(radian);
        ctx.fillText(`${angle}°`, labelX, labelY);
    }
}

// Function to plot the radar line
function drawRadarLine(angle) {
    if (angle < 0 || angle > 180) return;

    ctx.strokeStyle = "rgba(120, 140, 255, 1)";
    ctx.lineWidth = 3;

    const radian = angle * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - radarRadius * Math.cos(radian), centerY - radarRadius * Math.sin(radian));
    ctx.stroke();
}

// Function to plot an object on the radar
function drawObject(angle, distance) {
    if (angle < 0 || angle > 180) return;

    const radian = angle * Math.PI / 180;
    const pixelDistance = (distance / 40) * radarRadius; // Scale to radar radius

    ctx.strokeStyle = "rgba(255, 10, 10, 1)";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(centerX - pixelDistance * Math.cos(radian), centerY - pixelDistance * Math.sin(radian));
    ctx.lineTo(centerX - radarRadius * Math.cos(radian), centerY - radarRadius * Math.sin(radian));
    ctx.stroke();
}

// Function to update the radar
function updateRadar(angle, distance) {
    // Clear only the radar area (with a slight transparent fill for motion blur effect)
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRadarGrid();
    drawRadarLine(angle);
    if (distance < 40) {
        drawObject(angle, distance);
    }
}

let prevDistance = 50; // Initialize previous distance
let objectDetected = false; // Flag to track if an object is detected
let objectCounter = 0; // Counter for how many tries an object is detected
const maxObjectTries = Math.floor(Math.random() * (40 - 20 + 1)) + 20; // Random number of tries for detecting an object

// function simulateDistance() {
//     let distance;

//     if (objectDetected) {
//         // If an object is detected, set distance to a random value close to the previous distance
//         distance = Math.random() * (prevDistance + 5 - (prevDistance - 5)) + (prevDistance - 5);
//         objectCounter++;
//         if (objectCounter >= maxObjectTries) {
//             // Stop detecting the object after the specified number of tries
//             objectDetected = false;
//             objectCounter = 0;
//             maxObjectTries = Math.floor(Math.random() * (50 - 25 + 1)) + 25; // Reset the max tries
//         }
//     } else {
//         // If no object is detected, generate a distance greater than 40
//         distance = Math.random() * (100 - 40) + 40;

//         // Decide if an object should be detected
//         if (Math.random() < 0.95) { // 5% chance to detect an object
//             objectDetected = true;
//             objectCounter = 0;
//         }
//     }

//     prevDistance = distance; // Update previous distance
//     return distance;
// }


// Simulate receiving data from the Arduino
function simulateData() {
    let angle = 180;
    let increasing = false;  // To track whether the angle is increasing or decreasing

    setInterval(() => {
        // const distance = simulateDistance(); // Replace this with actual sensor data
        const distance = Math.random() * (100-5+1) + 5; 
        updateRadar(angle, distance);

        if (increasing) {
            angle++;
            if (angle >= 180) {
                increasing = false;
            }
        } else {
            angle--;
            if (angle <= 0) {
                increasing = true;
            }
        }
    }, 50);
}

simulateData();

// function updateRadar(angle, distance) {
//     ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     drawRadarGrid();
//     drawRadarLine(angle);
//     if (distance < 40) {
//         drawObject(angle, distance);
//     }
// }

// function fetchRadarData() {
//     fetch('http://localhost:3000/data')
//         .then(response => response.text())
//         .then(data => {
//             const [angle, distance] = data.split(',').map(Number);
//             updateRadar(angle, distance);
//         })
//         .catch(error => console.error('Error fetching radar data:', error));
// }

// // Call fetchRadarData periodically
// setInterval(fetchRadarData, 60); // Fetch data every 60ms

