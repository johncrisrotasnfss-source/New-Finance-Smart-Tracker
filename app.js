let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

let chart;

/* Folder Navigation */
function openFolder(id){
document.querySelectorAll(".folder").forEach(f=>{
f.classList.remove("active");
});

document.getElementById(id).classList.add("active");
renderChart();
updateUI();
}

/* Add Transaction */
function addTransaction(){

const amount=parseFloat(document.getElementById("amount").value);
const type=document.getElementById("type").value;
const category=document.getElementById("category").value;

if(!amount||amount<=0){
alert("Enter valid amount");
return;
}

transactions.push({amount,type,category});

localStorage.setItem("transactions",JSON.stringify(transactions));

document.getElementById("amount").value="";

renderChart();
updateUI();
}

/* Reset System */
function resetAll(){

if(!confirm("Reset all data?")) return;

localStorage.clear();

transactions=[];
budget=0;

renderChart();
updateUI();
}


/* UI Engine */
function updateUI(){

let income=0;
let expense=0;

transactions.forEach(t=>{
if(t.type==="income") income+=t.amount;
else expense+=t.amount;
});

document.getElementById("income").innerText=income.toFixed(2);
document.getElementById("expense").innerText=expense.toFixed(2);
document.getElementById("balance").innerText=(income-expense).toFixed(2);

updateBudget(expense);
renderChart();
}

/* Budget */

function setBudget(){

budget=parseFloat(document.getElementById("budgetInput").value)||0;

localStorage.setItem("budget",budget);

updateBudget(getTotalExpense());
}

function getTotalExpense(){

return transactions
.filter(t=>t.type==="expense")
.reduce((s,t)=>s+t.amount,0);

}

function updateBudget(expense){

document.getElementById("budgetDisplay").innerText=budget.toFixed(2);
document.getElementById("budgetRemaining").innerText=(budget-expense).toFixed(2);

renderChart();
updateUI();
}
   

// ===============================
// Professional Chart Rendering Engine
// ===============================

let chartInstance = null;

function renderChart() {

    const dashboard = document.getElementById("dashboard");

    if (!dashboard || !dashboard.classList.contains("active")) return;

    const canvas = document.getElementById("categoryChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Build category aggregation
    const categoryMap = {};

    transactions.forEach(t => {
        if (t.type === "expense") {
            categoryMap[t.category] =
                (categoryMap[t.category] || 0) + t.amount;
        }
    });

    const labels = Object.keys(categoryMap);
    const values = Object.values(categoryMap);

    if (chartInstance) {
        chartInstance.destroy();
    }

    if (labels.length === 0) {
        chartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["No Data"],
                datasets: [{
                    data: [1]
                }]
            },
            options: {
                responsive: true
            }
        });

        return;
    }

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
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
/* Init */
window.addEventListener("DOMContentLoaded",()=>{
updateUI();
});

function safeAutoRefresh() {

    const refreshKey = "finance_last_refresh";

    const lastRefresh = localStorage.getItem(refreshKey);
    const now = Date.now();

    // Refresh only if 5 seconds passed since last refresh
    if (!lastRefresh || now - parseInt(lastRefresh) > 5000) {

        localStorage.setItem(refreshKey, now);

        setTimeout(() => {
            updateUI();
        }, 300);
    }
}

// Run once when page loads
window.addEventListener("load", () => {
    safeAutoRefresh();
});

window.addEventListener("DOMContentLoaded", () => {
    renderChart();
});

// ===============================
// Optimized Star Particle Engine
// ===============================

const starCanvas = document.getElementById("stars");

if (starCanvas) {

    const ctx = starCanvas.getContext("2d");

    let stars = [];
    const STAR_COUNT = 70; // lower = smoother

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        starCanvas.width = window.innerWidth * dpr;
        starCanvas.height = window.innerHeight * dpr;
        starCanvas.style.width = window.innerWidth + "px";
        starCanvas.style.height = window.innerHeight + "px";
        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: Math.random() * 1.2,
                speed: Math.random() * 0.3 + 0.1
            });
        }
    }

    createStars();

    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let star of stars) {
            star.y += star.speed;

            if (star.y > window.innerHeight) {
                star.y = 0;
                star.x = Math.random() * window.innerWidth;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = "white";
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}