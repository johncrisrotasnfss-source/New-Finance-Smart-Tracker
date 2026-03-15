// ======================================
// FAMILY SMART FINANCE SYSTEM ENGINE
// ======================================

// Data storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

let financeChart;


// ======================================
// INITIALIZE SYSTEM
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    initializeChart();
    updateUI();
    startStarBackground();

});


// ======================================
// NAVIGATION
// ======================================

function openFolder(id){

    document.querySelectorAll(".folder").forEach(folder=>{
        folder.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    // Fix chart resizing when dashboard opens
    if(id==="dashboard" && financeChart){

        setTimeout(()=>{
            financeChart.resize();
            financeChart.update();
        },200);

    }

}


// ======================================
// ADD TRANSACTION
// ======================================

function addTransaction(){

    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if(!amount || amount <= 0){
        alert("Please enter a valid amount.");
        return;
    }

    const transaction = {
        amount,
        type,
        category,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("amount").value="";

    refreshDashboard();

}


// ======================================
// RESET SYSTEM
// ======================================

function resetAll(){

    if(!confirm("Reset all financial data?")) return;

    localStorage.removeItem("transactions");
    localStorage.removeItem("budget");

    transactions = [];
    budget = 0;

    refreshDashboard();

}


// ======================================
// REFRESH DASHBOARD
// ======================================

function refreshDashboard(){

    updateUI();

    if(financeChart){
        financeChart.update();
    }

}


// ======================================
// UPDATE UI
// ======================================

function updateUI(){

    let income = 0;
    let expense = 0;

    transactions.forEach(t=>{
        if(t.type==="income"){
            income += t.amount;
        }else{
            expense += t.amount;
        }
    });

    const balance = income - expense;

    document.getElementById("income").innerText = income.toFixed(2);
    document.getElementById("expense").innerText = expense.toFixed(2);
    document.getElementById("balance").innerText = balance.toFixed(2);

    updateBudgetDisplay(expense);
    updateChart(income, expense);

}

renderTransactionTable();

renderCategoryChart();

calculateHealth(income,expense);

updateBudgetBar(expense);

generateInsights(income,expense);


// ======================================
// BUDGET SYSTEM
// ======================================

function setBudget(){

    budget = parseFloat(document.getElementById("budgetInput").value) || 0;

    localStorage.setItem("budget", budget);

    refreshDashboard();

}


function updateBudgetDisplay(expense){

    document.getElementById("budgetDisplay").innerText = budget.toFixed(2);

    const remaining = budget - expense;

    document.getElementById("budgetRemaining").innerText = remaining.toFixed(2);

}


// ======================================
// CHART SYSTEM
// ======================================

function initializeChart(){

    const canvas = document.getElementById("financeChart");

    if(!canvas) return;

    if(financeChart){
        financeChart.destroy();
    }

    const ctx = canvas.getContext("2d");

    financeChart = new Chart(ctx, {

        type: "doughnut",

        data:{
            labels:["Income","Expenses"],
            datasets:[{
                data:[0,0],
                backgroundColor:[
                    "#7c3aed",
                    "#f43f5e"
                ],
                borderWidth:2
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false,

            plugins:{
                legend:{
                    labels:{
                        color:"white"
                    }
                }
            }
        }

    });

}


function updateChart(income,expense){

    if(!financeChart) return;

    financeChart.data.datasets[0].data = [income, expense];

}

let categoryChart;

function renderCategoryChart(){

let categories={};

transactions.forEach(t=>{

if(t.type==="expense"){

categories[t.category]=(categories[t.category]||0)+t.amount;

}

});

const labels=Object.keys(categories);
const data=Object.values(categories);

const ctx=document.getElementById("categoryChart");

if(!ctx) return;

if(categoryChart){
categoryChart.destroy();
}

categoryChart=new Chart(ctx,{

type:"pie",

data:{
labels:labels,
datasets:[{
data:data
}]
},

options:{
responsive:true
}

});

}


// ======================================
// STAR BACKGROUND SYSTEM
// ======================================

function startStarBackground(){

    const canvas = document.getElementById("stars");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    let stars = [];

    const STAR_COUNT = 70;

    function resizeCanvas(){

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);


    function createStars(){

        stars=[];

        for(let i=0;i<STAR_COUNT;i++){

            stars.push({

                x:Math.random()*canvas.width,
                y:Math.random()*canvas.height,
                radius:Math.random()*1.4,
                speed:Math.random()*0.3+0.1

            });

        }

    }

    createStars();


    function animate(){

        ctx.clearRect(0,0,canvas.width,canvas.height);

        stars.forEach(star=>{

            star.y += star.speed;

            if(star.y > canvas.height){

                star.y = 0;
                star.x = Math.random()*canvas.width;

            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI*2);
            ctx.fillStyle="white";
            ctx.fill();

        });

        requestAnimationFrame(animate);

    }

    animate();

}

function renderTransactionTable(){

const table=document.getElementById("transactionTable");

table.innerHTML="";

transactions.slice(-5).reverse().forEach(t=>{

table.innerHTML+=`
<tr>
<td>${t.type}</td>
<td>${t.category}</td>
<td>₱${t.amount}</td>
</tr>
`;

});

}

function calculateHealth(income,expense){

if(income===0) return 0;

let ratio=expense/income;

let score=Math.round((1-ratio)*100);

score=Math.max(0,Math.min(score,100));

document.getElementById("healthScore").innerText=score;

}

function updateBudgetBar(expense){

if(budget===0) return;

let percent=(expense/budget)*100;

percent=Math.min(percent,100);

document.getElementById("budgetFill").style.width=percent+"%";

}

function generateInsights(income,expense){

const insights=document.getElementById("insightsList");

insights.innerHTML="";

if(income===0){
insights.innerHTML+="<li>Add income to start analysis.</li>";
return;
}

let ratio=expense/income;

if(ratio>0.8){
insights.innerHTML+="<li>⚠ Spending is very high.</li>";
}

if(ratio<0.5){
insights.innerHTML+="<li>✅ Great savings behavior.</li>";
}

if(expense>budget && budget>0){
insights.innerHTML+="<li>🚨 Budget exceeded.</li>";
}

}