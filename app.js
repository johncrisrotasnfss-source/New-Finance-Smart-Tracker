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
// ADD TRANSACTION
// ===============================

function addTransaction(){

const amount = parseFloat(document.getElementById("amount").value);
const type = document.getElementById("type").value;
const category = document.getElementById("category").value;

if(!amount || amount <= 0){
alert("Enter valid amount");
return;
}

transactions.push({amount,type,category});

localStorage.setItem("transactions",JSON.stringify(transactions));

document.getElementById("amount").value="";

updateUI();

}

// ===============================
// RESET SYSTEM
// ===============================

function resetAll(){

if(!confirm("Reset all data?")) return;

localStorage.removeItem("transactions");
localStorage.removeItem("budget");

transactions=[];
budget=0;

updateUI();

}

// ===============================
// UI ENGINE
// ===============================

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

// Budget
updateBudgetDisplay(expense);

// Chart
updateChart(income,expense);

// Smart Intelligence
updateIntelligence(income,expense);

}

// ===============================
// BUDGET SYSTEM
// ===============================

function setBudget(){

budget=parseFloat(document.getElementById("budgetInput").value)||0;

localStorage.setItem("budget",budget);

updateUI();

}

function updateBudgetDisplay(expense){

document.getElementById("budgetDisplay").innerText=budget.toFixed(2);
document.getElementById("budgetRemaining").innerText=(budget-expense).toFixed(2);

}

// ===============================
// CHART SYSTEM
// ===============================

function initializeChart(){

const ctx=document.getElementById("financeChart").getContext("2d");

financeChart=new Chart(ctx,{
type:"doughnut",
data:{
labels:["Income","Expenses"],
datasets:[{
data:[0,0],
backgroundColor:["#6C63FF","#FF6584"],
borderWidth:2
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{
labels:{color:"white"}
}
}
}
});

}

function updateChart(income,expense){

if(!financeChart) return;

financeChart.data.datasets[0].data=[income,expense];

financeChart.update("none");

}

// ===============================
// FINANCIAL HEALTH ENGINE
// ===============================

function calculateFinancialHealth(income,expense,budget){

if(income===0) return 0;

let expenseRatio=expense/income;
let budgetPressure=budget>0 ? expense/budget : 0;

let score=
(1-expenseRatio)*60+
(1-budgetPressure)*40;

score=Math.round(score);

score=Math.max(0,Math.min(100,score));

return score;

}

// ===============================
// SPENDING PATTERN ANALYZER
// ===============================

function analyzeSpendingPattern(){

let categories={};

transactions.forEach(t=>{

if(t.type==="expense"){

categories[t.category]=(categories[t.category]||0)+t.amount;

}

});

let maxCategory="None";
let maxValue=0;

for(let cat in categories){

if(categories[cat]>maxValue){

maxValue=categories[cat];
maxCategory=cat;

}

}

return maxCategory;

}

// ===============================
// EXPENSE PREDICTION ENGINE
// ===============================

function predictNextExpense(){

let expenses=transactions
.filter(t=>t.type==="expense")
.map(t=>t.amount);

if(expenses.length<3) return 0;

let avg=expenses.reduce((a,b)=>a+b,0)/expenses.length;

return (avg*1.1).toFixed(2);

}

// ===============================
// SMART FINANCIAL ADVISOR
// ===============================

function generateAdvice(income,expense,budget){

let messages=[];

if(income===0){
messages.push("Add income to begin financial analysis.");
return messages;
}

let ratio=expense/income;

if(ratio>0.9)
messages.push("⚠ You are spending almost all your income.");

if(ratio>0.7 && ratio<=0.9)
messages.push("⚡ Spending is high. Consider reducing wants.");

if(ratio<0.5)
messages.push("✅ Good saving habit detected.");

if(budget>0 && expense>budget)
messages.push("🚨 Budget exceeded!");

return messages;

}

// ===============================
// INTELLIGENCE DASHBOARD
// ===============================

function updateIntelligence(income,expense){

let health=calculateFinancialHealth(income,expense,budget);

document.getElementById("healthScore").innerText=health;

let alerts=document.getElementById("alertsList");

if(!alerts) return;

alerts.innerHTML="";

let pattern=analyzeSpendingPattern();

alerts.innerHTML+=
`<li>📊 Highest spending category: ${pattern}</li>`;

let prediction=predictNextExpense();

if(prediction>0){

alerts.innerHTML+=
`<li>🔮 Predicted next expense: ₱${prediction}</li>`;

}

let advice=generateAdvice(income,expense,budget);

advice.forEach(msg=>{
alerts.innerHTML+=`<li>${msg}</li>`;
});

}

// ===============================
// STAR BACKGROUND
// ===============================

function startStarBackground(){

const canvas=document.getElementById("stars");

if(!canvas) return;

const ctx=canvas.getContext("2d");

let stars=[];
const STAR_COUNT=60;

function resize(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);

for(let i=0;i<STAR_COUNT;i++){

stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
radius:Math.random()*1.5,
speed:Math.random()*0.3+0.1
});

}

function animate(){

ctx.clearRect(0,0,canvas.width,canvas.height);

stars.forEach(star=>{

star.y+=star.speed;

if(star.y>canvas.height){

star.y=0;
star.x=Math.random()*canvas.width;

}

ctx.beginPath();
ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();

});

requestAnimationFrame(animate);

}

animate();

}