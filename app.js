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
generateAIInsight();
    updateUI();
}

// ===== RESET =====
function resetAll() {
    if (!confirm("Are you sure you want to reset all data?")) return;

    // Clear storage
    localStorage.removeItem("transactions");
    localStorage.removeItem("budget");

    // Reset displayed numbers
    document.getElementById("income").innerText = "0";
    document.getElementById("expense").innerText = "0";
    document.getElementById("balance").innerText = "0";
    document.getElementById("aiAnalysis").innerText = "";

    document.getElementById("budgetDisplay").innerText = "0";
    document.getElementById("budgetRemaining").innerText = "0";

    // Clear inputs
    document.getElementById("amount").value = "";
    document.getElementById("budgetInput").value = "";

    // Reset charts if chart exists
    if (window.categoryChart) {
        window.categoryChart.destroy();
    }

    // Reload page to ensure full reset
    location.reload();
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
function generateAIInsight() {
    let income = parseFloat(document.getElementById("income").innerText) || 0;
    let expense = parseFloat(document.getElementById("expense").innerText) || 0;
    let budget = parseFloat(document.getElementById("budgetDisplay").innerText) || 0;

    let balance = income - expense;
    let insight = "";

    // Spending risk analysis
    if (expense > income) {
        insight = "⚠️ Warning: Your expenses are higher than your income. Consider reducing non-essential spending.";
    }
    else if (expense > income * 0.7) {
        insight = "📊 High spending detected. You are using more than 70% of your income.";
    }
    else if (balance > budget) {
        insight = "🌟 Excellent! Your balance is above your budget limit.";
    }
    else if (balance < 0) {
        insight = "🔴 Your account is in deficit. Try to increase income or reduce expenses.";
    }
    else {
        insight = "💡 Your finances are stable. Maintain your current financial habits.";
    }

    document.getElementById("aiAnalysis").innerText = insight;
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