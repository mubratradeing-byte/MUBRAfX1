/**
 * MUBRA FX - Trading Journal
 * Manages trade entries with LocalStorage persistence
 */

// Get DOM elements
const tradeForm = document.getElementById('tradeForm');
const journalTableBody = document.getElementById('journalTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const clearAllBtn = document.getElementById('clearAllBtn');

// Form inputs
const tradeDateInput = document.getElementById('tradeDate');
const tradePairInput = document.getElementById('tradePair');
const tradeTypeInput = document.getElementById('tradeType');
const tradeRiskInput = document.getElementById('tradeRisk');
const tradeResultInput = document.getElementById('tradeResult');
const tradeNotesInput = document.getElementById('tradeNotes');

// LocalStorage key
const STORAGE_KEY = 'mubrafx_trades';

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    tradeDateInput.valueAsDate = new Date();
    
    // Load and display existing trades
    loadTrades();
});

/**
 * Handle form submission
 */
tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const trade = {
        id: Date.now(), // Unique ID
        date: tradeDateInput.value,
        pair: tradePairInput.value.trim().toUpperCase(),
        type: tradeTypeInput.value,
        risk: parseFloat(tradeRiskInput.value),
        result: parseFloat(tradeResultInput.value),
        notes: tradeNotesInput.value.trim()
    };
    
    // Validate trade
    if (!validateTrade(trade)) {
        return;
    }
    
    // Add trade to storage
    addTrade(trade);
    
    // Reset form
    tradeForm.reset();
    tradeDateInput.valueAsDate = new Date();
    
    // Show success feedback
    showNotification('Trade added successfully!');
});

/**
 * Validate trade data
 */
function validateTrade(trade) {
    if (!trade.date || !trade.pair || !trade.type) {
        alert('Please fill in all required fields');
        return false;
    }
    
    if (trade.risk <= 0) {
        alert('Risk percentage must be greater than zero');
        return false;
    }
    
    return true;
}

/**
 * Add trade to LocalStorage and update display
 */
function addTrade(trade) {
    // Get existing trades
    const trades = getTrades();
    
    // Add new trade to beginning of array
    trades.unshift(trade);
    
    // Save to LocalStorage
    saveTrades(trades);
    
    // Update display
    displayTrades(trades);
}

/**
 * Delete trade by ID
 */
function deleteTrade(id) {
    if (!confirm('Are you sure you want to delete this trade?')) {
        return;
    }
    
    // Get existing trades
    let trades = getTrades();
    
    // Filter out the trade with matching ID
    trades = trades.filter(trade => trade.id !== id);
    
    // Save updated trades
    saveTrades(trades);
    
    // Update display
    displayTrades(trades);
    
    showNotification('Trade deleted');
}

/**
 * Clear all trades
 */
clearAllBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to delete ALL trades? This cannot be undone.')) {
        return;
    }
    
    // Clear LocalStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Update display
    displayTrades([]);
    
    showNotification('All trades cleared');
});

/**
 * Load trades from LocalStorage
 */
function loadTrades() {
    const trades = getTrades();
    displayTrades(trades);
}

/**
 * Get trades from LocalStorage
 */
function getTrades() {
    const tradesJSON = localStorage.getItem(STORAGE_KEY);
    return tradesJSON ? JSON.parse(tradesJSON) : [];
}

/**
 * Save trades to LocalStorage
 */
function saveTrades(trades) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
}

/**
 * Display trades in table
 */
function displayTrades(trades) {
    // Clear existing table
    journalTableBody.innerHTML = '';
    
    // Show/hide empty message
    if (trades.length === 0) {
        emptyMessage.classList.add('show');
        return;
    } else {
        emptyMessage.classList.remove('show');
    }
    
    // Create table rows
    trades.forEach(trade => {
        const row = createTradeRow(trade);
        journalTableBody.appendChild(row);
    });
}

/**
 * Create table row for a trade
 */
function createTradeRow(trade) {
    const tr = document.createElement('tr');
    
    // Format date
    const formattedDate = new Date(trade.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Determine trade type class
    const typeClass = trade.type === 'Buy' ? 'trade-buy' : 'trade-sell';
    
    // Determine result class
    const resultClass = trade.result >= 0 ? 'result-positive' : 'result-negative';
    const resultSign = trade.result >= 0 ? '+' : '';
    
    tr.innerHTML = `
        <td>${formattedDate}</td>
        <td><strong>${trade.pair}</strong></td>
        <td><span class="${typeClass}">${trade.type}</span></td>
        <td>${trade.risk}%</td>
        <td><span class="${resultClass}">${resultSign}$${trade.result.toFixed(2)}</span></td>
        <td>${trade.notes || '-'}</td>
        <td>
            <button class="btn btn-delete" onclick="deleteTrade(${trade.id})">Delete</button>
        </td>
    `;
    
    return tr;
}

/**
 * Show notification message
 */
function showNotification(message) {
    // Create notification element
    const notification =
