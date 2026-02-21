// ===============================
// Advanced AI Insight Engine
// Family Smart Finance System
// ===============================

function calculateFinancialInsight() {
    let income = parseFloat(document.getElementById("income")?.innerText) || 0;
    let expense = parseFloat(document.getElementById("expense")?.innerText) || 0;
    let budget = parseFloat(document.getElementById("budgetDisplay")?.innerText) || 0;

    let balance = income - expense;
    let insight = "";

    // Financial risk analysis
    if (expense > income) {
        insight = "⚠️ Warning: Your expenses are higher than your income. Consider reducing unnecessary spending.";
    }
    else if (expense > income * 0.7) {
        insight = "📊 High spending detected. You are using more than 70% of your income.";
    }
    else if (balance < 0) {
        insight = "🔴 Your account is in deficit. Try to increase income or reduce expenses.";
    }
    else if (budget > 0 && balance > budget) {
        insight = "🌟 Excellent! Your balance is above your budget limit.";
    }
    else {
        insight = "💡 Your finances are stable. Maintain your current financial habits.";
    }

    const aiBox = document.getElementById("aiAnalysis");
    if (aiBox) aiBox.innerText = insight;
}

// Auto update AI insight every 3 seconds
setInterval(calculateFinancialInsight, 3000);

// Run insight engine on page load
window.addEventListener("load", calculateFinancialInsight);

// Optional: Call this after transaction or budget update
function refreshAIInsight() {
    calculateFinancialInsight();
}
