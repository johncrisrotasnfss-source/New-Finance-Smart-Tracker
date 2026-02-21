// ===============================
// Family Smart Finance System
// Clean Unified Version
// ===============================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

let chart;

// ===== FOLDER NAVIGATION =====
function openFolder(id) {
    document.querySelectorAll(".folder").forEach(folder => {
        folder.classList.remove("active");
    });

    const target = document.getElementById(id);
    if (target) target.classList.add("active");

    updateUI();
}

// ===== ADD TRANSACTION =====
function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!amount || amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    transactions.push({ amount, type, category });

    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("amount").value = "";

    updateUI();
}

// ===== RESET SYSTEM =====
function resetAll() {
    if (!confirm("Are you sure you want to reset all data?")) return;

    // ===== Clear Storage =====
    localStorage.removeItem("transactions");
    localStorage.removeItem("budget");

    // ===== Reset Memory State =====
    transactions = [];
    budget = 0;

    // ===== Reset UI Numbers =====
    document.getElementById("income").innerText = "0";
    document.getElementById("expense").innerText = "0";
    document.getElementById("balance").innerText = "0";

    document.getElementById("aiAnalysis").innerText = "";

    document.getElementById("budgetDisplay").innerText = "0";
    document.getElementById("budgetRemaining").innerText = "0";

    document.getElementById("amount").value = "";
    document.getElementById("budgetInput").value = "";

    // ===== Proper Chart Reset =====
    if (chart) {
        chart.destroy();
        chart = null;
    }

    // ===== Restore Dashboard View =====
    document.querySelectorAll(".folder").forEach(folder => {
        folder.classList.remove("active");
    });

    const dashboard = document.getElementById("dashboard");
    if (dashboard) dashboard.classList.add("active");

    // ===== Rebuild Empty Chart =====
    setTimeout(() => {
        updateChart();
    }, 150);
}

// ===== UI UPDATE ENGINE =====
function updateUI() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("income").innerText = income.toFixed(2);
    document.getElementById("expense").innerText = expense.toFixed(2);
    document.getElementById("balance").innerText =
        (income - expense).toFixed(2);

    updateBudget(expense);
    updateChart();
}

// ===== BUDGET SYSTEM =====
function setBudget() {
    budget = parseFloat(document.getElementById("budgetInput").value) || 0;

    localStorage.setItem("budget", budget);

    document.getElementById("budgetDisplay").innerText =
        budget.toFixed(2);

    updateBudget(getTotalExpense());
}

function getTotalExpense() {
    return transactions
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
}

function updateBudget(expense) {
    document.getElementById("budgetDisplay").innerText =
        budget.toFixed(2);

    document.getElementById("budgetRemaining").innerText =
        (budget - expense).toFixed(2);
}

// ===== CATEGORY CHART =====
function updateChart() {
   
    if (!document.getElementById("dashboard").classList.contains("active")) {
    document.getElementById("dashboard").classList.add("active");
}

    const canvas = document.getElementById("categoryChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const categories = {};

    transactions.forEach(t => {
        if (t.type === "expense") {
            categories[t.category] =
                (categories[t.category] || 0) + t.amount;
        }
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels,
            datasets: [{
                data: values
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// ===== STAR BACKGROUND =====
const starCanvas = document.getElementById("stars");

if (starCanvas) {
    const ctx = starCanvas.getContext("2d");

    function resizeCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }

    resizeCanvas();

    let stars = [];

    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.5
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

        ctx.fillStyle = "white";

        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > starCanvas.height) star.y = 0;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    window.addEventListener("resize", resizeCanvas);

    animateStars();
}

// ===== INIT =====
window.addEventListener("DOMContentLoaded", updateUI);