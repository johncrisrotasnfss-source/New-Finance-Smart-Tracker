// ===============================
// DATA STORAGE
// ===============================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;
let financeChart;

// ===============================
// INITIALIZE SYSTEM
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    initializeChart();
    updateUI();
    startStarBackground();
});

// ===============================
// NAVIGATION
// ===============================

function openFolder(id) {
    document.querySelectorAll(".folder").forEach(f => {
        f.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    if (id === "dashboard" && financeChart) {
        setTimeout(() => financeChart.resize(), 150);
    }
}

// ===============================
// ADD TRANSACTION
// ===============================

function addTransaction() {

    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!amount || amount <= 0) {
        alert("Enter a valid amount.");
        return;
    }

    transactions.push({ amount, type, category });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("amount").value = "";

    updateUI();
}

// ===============================
// RESET SYSTEM
// ===============================

function resetAll() {

    if (!confirm("Reset all data?")) return;

    localStorage.removeItem("transactions");
    localStorage.removeItem("budget");

    transactions = [];
    budget = 0;

    updateUI();
}

// ===============================
// UI ENGINE
// ===============================

function updateUI() {

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("income").innerText = income.toFixed(2);
    document.getElementById("expense").innerText = expense.toFixed(2);
    document.getElementById("balance").innerText = (income - expense).toFixed(2);

    updateBudgetDisplay(expense);
    updateChart(income, expense);
}

// ===============================
// BUDGET
// ===============================

function setBudget() {

    budget = parseFloat(document.getElementById("budgetInput").value) || 0;
    localStorage.setItem("budget", budget);

    updateUI();
}

function updateBudgetDisplay(expense) {

    document.getElementById("budgetDisplay").innerText = budget.toFixed(2);
    document.getElementById("budgetRemaining").innerText = (budget - expense).toFixed(2);
}

// ===============================
// CHART ENGINE
// ===============================

function initializeChart() {

    const ctx = document.getElementById("financeChart").getContext("2d");

    financeChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expenses"],
            datasets: [{
                data: [0, 0],
                backgroundColor: ["#6C63FF", "#FF6584"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}

function updateChart(income, expense) {

    if (!financeChart) return;

    financeChart.data.datasets[0].data = [income, expense];
    financeChart.update();
}

// ===============================
// STAR BACKGROUND
// ===============================

function startStarBackground() {

    const starCanvas = document.getElementById("stars");
    if (!starCanvas) return;

    const ctx = starCanvas.getContext("2d");

    let stars = [];
    const STAR_COUNT = 60;

    function resizeCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                radius: Math.random() * 1.5,
                speed: Math.random() * 0.3 + 0.1
            });
        }
    }

    createStars();

    function animate() {
        ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > starCanvas.height) {
                star.y = 0;
                star.x = Math.random() * starCanvas.width;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}