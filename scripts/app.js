import{ initState } from './state.js';
import{ initUI} from'./ui.js';
import './storage.js';
import './validators.js';
import './search.js';

document.addEventListener('DOMContentLoaded',() => {
    console.log('Initializing Student Finance Tracker...');
    
    // Initializing State and Load storage record
    if (typeof initState ==='function'){
        initState();
    }
    
    //Initiazing UI event Listeners and Rendering
    if(typeof initUI === 'fuction'){
        initUI();
    }
});

const SEED_TRANSACTIONS = [
    { 
        id: "tx-1", 
        description: "University Tuition Deposit", 
        amount: 1200.00, 
        type: "expense", 
        date: "2026-01-10", 
        category: "Tuition" 
    },

    { 
        id: "tx-2", 
        description: "Part-time Library Stipend", 
        amount: 450.00, 
        type: "income", 
        date: "2026-01-15", 
        category: "Income" 
    },

    { 
        id: "tx-3", 
        description: "Textbook: Advanced Data Analysis", 
        amount: 85.50, 
        type: "expense", 
        date: "2026-01-20", 
        category: "Books" 
    },

    { 
        id: "tx-4", 
        description: "Campus Housing Rent", 
        amount: 400.00, type: "expense", 
        date: "2026-02-01", 
        category: "Housing" 
    },
    
    { 
        id: "tx-5", 
        description: "Coding Bootcamp Grant", 
        amount: 600.00, 
        type: "income", 
        date: "2026-02-10", 
        category: "Income" 
    },

    { 
        id: "tx-6", 
        description: "Grocery Run - Bulk Supplies", 
        amount: 120.30, 
        type: "expense", 
        date: "2026-02-14", 
        category: "Food" 
    },

    { 
        id: "tx-7", 
        description: "High-speed Fiber Internet", 
        amount: 45.00, 
        type: "expense", 
        date: "2026-02-28", 
        category: "Utilities" 
    },

    { 
        id: "tx-8", 
        description: "Freelance Web Dev Gig", 
        amount: 350.00, 
        type: "income", 
        date: "2026-03-05", 
        category: "Income" 
    },

    { 
        id: "tx-9", 
        description: "Lab Equipment & USB Hub", 
        amount: 35.00, 
        type: "expense", 
        date: "2026-03-12", 
        category: "Supplies" 
    },

    { 
        id: "tx-10", 
        description: "Coffee & Study Snacks", 
        amount: 24.50, 
        type: "expense", 
        date: "2026-03-18", 
        category: "Food" 
    }
];

class FinanceStore {
    constructor() {
        this.storageKey = "student_finance_transactions_v2";
        this.transactions = this.loadTransactions();
    }

    loadTransactions() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            this.saveTransactions(SEED_TRANSACTIONS);
            return [...SEED_TRANSACTIONS];
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse local storage data, falling back to seed data:", e);
            return [...SEED_TRANSACTIONS];
        }
    }

    saveTransactions(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadBudgetCap() {
        const storedCap = localStorage.getItem(this.storageKey + "_cap");
        return storedCap ? parseFloat(storedCap) : 2500.00;
    }

    saveBudgetCap(cap) {
        localStorage.setItem(this.storageKey + "_cap", cap);
    }

    loadCurrency() {
        return localStorage.getItem(this.storageKey + "_currency") || "frw";
    }

    saveCurrency(currency) {
        localStorage.setItem(this.storageKey + "_currency", currency);
    }

    addTransaction(transaction) {
        const newTx = {
            id: "tx-" + Date.now(),
            ...transaction,
            amount: parseFloat(transaction.amount)
        };
        this.transactions.unshift(newTx);
        this.saveTransactions(this.transactions);
        return newTx;
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(tx => tx.id !== id);
        this.saveTransactions(this.transactions);
    }

    getTotals() {
        return this.transactions.reduce((acc, tx) => {
            if (tx.type === "income") {
                acc.income += tx.amount;
                acc.balance += tx.amount;
            } else {
                acc.expense += tx.amount;
                acc.balance -= tx.amount;
            }
            return acc;
        }, { balance: 0, income: 0, expense: 0 });
    }

    getCategoryBreakdown() {
        const expenses = this.transactions.filter(tx => tx.type === "expense");
        const totals = {};
        let totalExpense = 0;

        expenses.forEach(tx => {
            totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
            totalExpense += tx.amount;
        });

        return { totals, totalExpense };
    }

    exportCSV() {
        if (this.transactions.length === 0) return;
        const headers = ["ID", "Date", "Description", "Category", "Type", "Amount"];
        const rows = this.transactions.map(tx => [
            tx.id,
            tx.date,
            `"${tx.description.replace(/"/g, '""')}"`,
            tx.category,
            tx.type,
            tx.amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `student_finance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    importJSON(fileText) {
        try {
            const parsedData = JSON.parse(fileText);
            
            if (!Array.isArray(parsedData)) {
                throw new Error("Invalid format: Root structure must be an array.");
            }

            const validTransactions = parsedData.map(tx => {
                if (!tx.description || typeof tx.amount !== 'number' || !tx.date) {
                    throw new Error("Invalid transaction schema found during validation.");
                }
                return {
                    id: tx.id || "tx-" + Date.now() + Math.random(),
                    description: tx.description,
                    amount: parseFloat(tx.amount),
                    type: tx.type === 'income' ? 'income' : 'expense',
                    date: tx.date,
                    category: tx.category || "General"
                };
            });

            this.transactions = validTransactions;
            this.saveTransactions(this.transactions);
            return { success: true, count: validTransactions.length };
        } catch (e) {
            console.error("JSON Import Validation Failed:", e);
            return { success: false, error: e.message };
        }
    }

    resetData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey + "_cap");
        localStorage.removeItem(this.storageKey + "_currency");
        this.transactions = [...SEED_TRANSACTIONS];
        this.saveTransactions(this.transactions);
    }
}

export const store = new FinanceStore();

document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transaction-form");
    const transactionTableBody = document.getElementById("transaction-table-body");
    const totalBalanceEl = document.getElementById("total-balance");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");
    const searchInput = document.getElementById("search-input");
    const filterCategory = document.getElementById("filter-category");
    const categoryBreakdownEl = document.getElementById("category-breakdown");
    const btnExportCsv = document.getElementById("btn-export-csv");
    const btnExportPdf = document.getElementById("btn-export-pdf");
    const btnReset = document.getElementById("btn-reset");
    const btnImport = document.getElementById("btn-import");
    const importFileInput = document.getElementById("import-file-input");
    const currencySelect = document.getElementById("currency-select");
    const budgetCapInput = document.getElementById("budget-cap-input");
    const btnSetCap = document.getElementById("btn-set-cap");
    const capProgressBar = document.getElementById("cap-progress-bar");
    const capStatusText = document.getElementById("cap-status-text");
    const capWarning = document.getElementById("cap-warning");
    const srAnnouncer = document.getElementById("sr-announcer");

    let currentCap = store.loadBudgetCap();
    let currentCurrency = store.loadCurrency();

    if (budgetCapInput) budgetCapInput.value = currentCap;
    if (currencySelect) currencySelect.value = currentCurrency;

    function announceToScreenReader(message) {
        if (srAnnouncer) {
            srAnnouncer.textContent = message;
        }
    }

    function render() {
        const totals = store.getTotals();
        if (totalBalanceEl) totalBalanceEl.textContent = `${totals.balance.toFixed(2)} ${currentCurrency}`;
        if (totalIncomeEl) totalIncomeEl.textContent = `${totals.income.toFixed(2)} ${currentCurrency}`;
        if (totalExpenseEl) totalExpenseEl.textContent = `${totals.expense.toFixed(2)} ${currentCurrency}`;

        // Budget Cap & Target Calculations
        const capPercentage = currentCap > 0 ? Math.min((totals.expense / currentCap) * 100, 100) : 0;
        const exactPercentage = currentCap > 0 ? ((totals.expense / currentCap) * 100).toFixed(1) : 0;

        if (capStatusText) {
            capStatusText.textContent = `Cap: ${currentCap.toFixed(2)} ${currentCurrency} | Spent: ${totals.expense.toFixed(2)} ${currentCurrency} (${exactPercentage}%)`;
        }
        if (capProgressBar) {
            capProgressBar.style.width = `${capPercentage}%`;
            if (totals.expense > currentCap) {
                capProgressBar.style.background = "var(--danger)";
                capProgressBar.style.boxShadow = "0 0 10px var(--danger)";
                if (capWarning) capWarning.style.display = "block";
            } else {
                capProgressBar.style.background = "var(--primary)";
                capProgressBar.style.boxShadow = "none";
                if (capWarning) capWarning.style.display = "none";
            }
        }

        // Render Analytics Category Breakdown
        if (categoryBreakdownEl) {
            const { totals: catTotals, totalExpense } = store.getCategoryBreakdown();
            categoryBreakdownEl.innerHTML = "";
            
            if (Object.keys(catTotals).length === 0) {
                categoryBreakdownEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No expense data available for breakdown.</p>`;
            } else {
                for (const [category, amount] of Object.entries(catTotals)) {
                    const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                    const item = document.createElement("div");
                    item.innerHTML = `
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                            <span>${category}</span>
                            <span style="font-family: var(--font-mono);">${amount.toFixed(2)} ${currentCurrency} (${percentage}%)</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: var(--well-bg); border-radius: 3px; overflow: hidden; border: 1px solid var(--border);">
                            <div style="width: ${percentage}%; height: 100%; background: var(--accent); box-shadow: 0 0 8px var(--accent);"></div>
                        </div>
                    `;
                    categoryBreakdownEl.appendChild(item);
                }
            }
        }

        // Filter and Search logic
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedCategory = filterCategory ? filterCategory.value : "";

        const filteredTransactions = store.transactions.filter(tx => {
            const matchesSearch = tx.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === "" || tx.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Render Transaction Table
        if (transactionTableBody) {
            transactionTableBody.innerHTML = "";
            if (filteredTransactions.length === 0) {
                transactionTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No matching transactions found.</td></tr>`;
                return;
            }

            filteredTransactions.forEach(tx => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${tx.date}</td>
                    <td>${tx.description}</td>
                    <td>${tx.category}</td>
                    <td style="color: ${tx.type === 'income' ? 'var(--primary)' : 'var(--danger)'}">
                        ${tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)} ${currentCurrency}
                    </td>
                    <td><button data-id="${tx.id}" class="btn-delete">Delete</button></td>
                `;
                transactionTableBody.appendChild(tr);
            });
        }
    }

    if (currencySelect) {
        currencySelect.addEventListener("change", (e) => {
            currentCurrency = e.target.value;
            store.saveCurrency(currentCurrency);
            render();
            announceToScreenReader(`Currency unit updated to ${currentCurrency.toUpperCase()}.`);
        });
    }

    if (btnSetCap) {
        btnSetCap.addEventListener("click", () => {
            const newCap = parseFloat(budgetCapInput.value);
            if (!isNaN(newCap) && newCap >= 0) {
                currentCap = newCap;
                store.saveBudgetCap(currentCap);
                render();
                announceToScreenReader(`Budget cap updated to ${currentCap} ${currentCurrency}.`);
            }
        });
    }

    if (transactionForm) {
        transactionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const description = document.getElementById("description")?.value;
            const amount = document.getElementById("amount")?.value;
            const type = document.getElementById("type")?.value || "expense";
            const category = document.getElementById("category")?.value;
            const date = document.getElementById("date")?.value || new Date().toISOString().split('T')[0];

            if (!description || !amount) return;

            store.addTransaction({
                description,
                amount: parseFloat(amount),
                type,
                category: category || "General",
                date
            });

            transactionForm.reset();
            render();
            announceToScreenReader(`Added transaction ${description} for ${amount} ${currentCurrency}.`);
        });
    }

    if (transactionTableBody) {
        transactionTableBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                const id = e.target.getAttribute("data-id");
                store.deleteTransaction(id);
                render();
                announceToScreenReader("Transaction deleted.");
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", render);
    if (filterCategory) filterCategory.addEventListener("change", render);

    if (btnExportCsv) {
        btnExportCsv.addEventListener("click", () => {
            store.exportCSV();
        });
    }

    if (btnExportPdf) {
        btnExportPdf.addEventListener("click", () => {
            window.print();
        });
    }

    if (btnImport && importFileInput) {
        btnImport.addEventListener("click", () => {
            importFileInput.click();
        });

        importFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = store.importJSON(event.target.result);
                if (result.success) {
                    render();
                    alert(`Successfully imported ${result.count} transactions!`);
                    announceToScreenReader(`Successfully imported ${result.count} transactions.`);
                } else {
                    alert(`Import failed: ${result.error}`);
                }
                importFileInput.value = "";
            };
            reader.readAsText(file);
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all transactions and settings back to defaults?")) {
                store.resetData();
                currentCap = store.loadBudgetCap();
                currentCurrency = store.loadCurrency();
                if (budgetCapInput) budgetCapInput.value = currentCap;
                if (currencySelect) currencySelect.value = currentCurrency;
                render();
                announceToScreenReader("Data and settings reset to default records.");
            }
        });
    }

    render();
});