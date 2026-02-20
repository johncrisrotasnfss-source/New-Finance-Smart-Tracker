// ===== STORAGE =====
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

// ===== FOLDER NAV =====
function openFolder(id) {
    document.querySelectorAll(".folder").forEach(folder => {
        folder.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
}

// ===== ADD TRANSACTION =====
function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!amount || amount <= 0) return alert("Enter valid amount");

    transactions.push({ amount, type, category });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateUI();
}

// ===== UPDATE UI =====
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

    updateBudget(expense);
    updateChart();
    runAIAnalysis(income, expense);
}

// ===== BUDGET =====
function setBudget() {
    budget = parseFloat(document.getElementById("budgetInput").value);
    localStorage.setItem("budget", budget);
    document.getElementById("budgetDisplay").innerText = budget.toFixed(2);
    updateBudget(getTotalExpense());
}

function getTotalExpense() {
    return transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
}

function updateBudget(expense) {
    document.getElementById("budgetDisplay").innerText = budget.toFixed(2);
    document.getElementById("budgetRemaining").innerText =
        (budget - expense).toFixed(2);
}

// ===== CATEGORY PIE CHART =====
let chart;

function updateChart() {
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

    const total = values.reduce((a, b) => a + b, 0);

    const colors = [
        "#a855f7", // nebula purple
        "#9333ea",
        "#7e22ce",
        "#c084fc",
        "#e879f9",
        "#f0abfc",
        "#d946ef",
        "#8b5cf6",
        "#6366f1"
    ];

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage =
                                ((value / total) * 100).toFixed(1);
                            return `${context.label}: ₱${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ===== SIMPLE AI ANALYSIS =====
function runAIAnalysis(income, expense) {
    const aiBox = document.getElementById("aiAnalysis");

    if (income === 0) {
        aiBox.innerText = "Start adding income to analyze your spending.";
        return;
    }

    const percent = (expense / income) * 100;

    if (percent > 90)
        aiBox.innerText = "⚠ You are spending almost all your income.";
    else if (percent > 70)
        aiBox.innerText = "⚡ Spending is high. Consider reducing expenses.";
    else
        aiBox.innerText = "✅ Good financial balance. Keep it up!";
}

// ===== STARS BACKGROUND =====
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

animateStars();

// ===== INIT =====
updateUI();