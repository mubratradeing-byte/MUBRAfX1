/**
 * MUBRA FX - Risk-Reward Calculator
 * Calculates risk amount, reward amount, and risk-reward ratio
 */

// Get DOM elements
const accountBalanceInput = document.getElementById('accountBalance');
const riskPercentageInput = document.getElementById('riskPercentage');
const stopLossInput = document.getElementById('stopLoss');
const takeProfitInput = document.getElementById('takeProfit');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultsSection');
const riskAmountDisplay = document.getElementById('riskAmount');
const rewardAmountDisplay = document.getElementById('rewardAmount');
const rrRatioDisplay = document.getElementById('rrRatio');

// Set today's default values
window.addEventListener('DOMContentLoaded', () => {
    // Optional: Set default values
    accountBalanceInput.value = '10000';
    riskPercentageInput.value = '2';
    stopLossInput.value = '50';
    takeProfitInput.value = '150';
});

// Add event listener to calculate button
calculateBtn.addEventListener('click', calculateRiskReward);

// Allow Enter key to trigger calculation
[accountBalanceInput, riskPercentageInput, stopLossInput, takeProfitInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateRiskReward();
        }
    });
});

/**
 * Main calculation function
 */
function calculateRiskReward() {
    // Get input values
    const accountBalance = parseFloat(accountBalanceInput.value);
    const riskPercentage = parseFloat(riskPercentageInput.value);
    const stopLoss = parseFloat(stopLossInput.value);
    const takeProfit = parseFloat(takeProfitInput.value);
    
    // Validate inputs
    if (!validateInputs(accountBalance, riskPercentage, stopLoss, takeProfit)) {
        return;
    }
    
    // Calculate risk amount
    const riskAmount = (accountBalance * riskPercentage) / 100;
    
    // Calculate reward amount
    const rewardAmount = (riskAmount * takeProfit) / stopLoss;
    
    // Calculate risk-reward ratio
    const rrRatio = takeProfit / stopLoss;
    
    // Display results
    displayResults(riskAmount, rewardAmount, rrRatio);
}

/**
 * Validate all input values
 */
function validateInputs(balance, risk, sl, tp) {
    // Check if all fields are filled
    if (isNaN(balance) || isNaN(risk) || isNaN(sl) || isNaN(tp)) {
        alert('Please fill in all fields with valid numbers');
        return false;
    }
    
    // Check for positive values
    if (balance <= 0 || risk <= 0 || sl <= 0 || tp <= 0) {
        alert('All values must be greater than zero');
        return false;
    }
    
    // Check risk percentage range
    if (risk > 100) {
        alert('Risk percentage cannot exceed 100%');
        return false;
    }
    
    // Warning for high risk
    if (risk > 5) {
        const confirm = window.confirm(
            `Warning: ${risk}% risk is high. Professional traders typically risk 1-2% per trade. Continue?`
        );
        if (!confirm) {
            return false;
        }
    }
    
    return true;
}

/**
 * Display calculation results
 */
function displayResults(risk, reward, ratio) {
    // Format and display risk amount
    riskAmountDisplay.textContent = `$${risk.toFixed(2)}`;
    
    // Format and display reward amount
    rewardAmountDisplay.textContent = `$${reward.toFixed(2)}`;
    
    // Format and display risk-reward ratio
    rrRatioDisplay.textContent = `1:${ratio.toFixed(2)}`;
    
    // Show results section with animation
    resultsSection.style.display = 'block';
    resultsSection.style.animation = 'fadeIn 0.5s ease';
    
    // Color code the ratio based on quality
    if (ratio >= 3) {
        rrRatioDisplay.style.color = 'var(--accent-green)';
    } else if (ratio >= 2) {
        rrRatioDisplay.style.color = 'var(--accent-yellow)';
    } else {
        rrRatioDisplay.style.color = '#ff6b6b';
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
