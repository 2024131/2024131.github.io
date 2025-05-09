// Countdown Timer Logic
const launchDate = new Date("2025-05-01T00:00:00Z").getTime();

// Function to update the countdown every second
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
        // Redirect to the game page when the countdown reaches zero
        window.location.href = "https://2024131.github.io-test";
        return;
    }

    // Calculate time remaining
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update the HTML with the countdown
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    document.getElementById("countdown-timer").innerHTML = `${hours}:${minutes}:${seconds}`;
}

// Call the updateCountdown function every second
setInterval(updateCountdown, 1000);

// Theme Toggle Functionality
const themeToggleButton = document.getElementById("theme-toggle");

themeToggleButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    // Toggle theme between dark and light
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        themeToggleButton.textContent = "🌙";  // Set icon for dark mode
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggleButton.textContent = "🌞";  // Set icon for light mode
    }
});
