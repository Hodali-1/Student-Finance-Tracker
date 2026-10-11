const SEED_TRANSACTIONS = [
    { id: "tx-1", description: "University Tuition Deposit", amount: 1200.00, type: "expense", date: "2026-01-10", category: "Tuition" },
    { id: "tx-2", description: "Part-time Library Stipend", amount: 450.00, type: "income", date: "2026-01-15", category: "Income" },
    { id: "tx-3", description: "Textbook: Advanced Data Analysis", amount: 85.50, type: "expense", date: "2026-01-20", category: "Books" },
    { id: "tx-4", description: "Campus Housing Rent", amount: 400.00, type: "expense", date: "2026-02-01", category: "Housing" },
    { id: "tx-5", description: "Coding Bootcamp Grant", amount: 600.00, type: "income", date: "2026-02-10", category: "Income" },
    { id: "tx-6", description: "Grocery Run - Bulk Supplies", amount: 120.30, type: "expense", date: "2026-02-14", category: "Food" },
    { id: "tx-7", description: "High-speed Fiber Internet", amount: 45.00, type: "expense", date: "2026-02-28", category: "Utilities" },
    { id: "tx-8", description: "Freelance Web Dev Gig", amount: 350.00, type: "income", date: "2026-03-05", category: "Income" },
    { id: "tx-9", description: "Lab Equipment & USB Hub", amount: 35.00, type: "expense", date: "2026-03-12", category: "Supplies" },
    { id: "tx-10", description: "Coffee & Study Snacks", amount: 24.50, type: "expense", date: "2026-03-18", category: "Food" }
];

class FinanceStore {
    constructor() {
        this.storageKey = "student_finance_transactions_v1";
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
}

export const store = new FinanceStore();

document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transaction-form");
    const transactionTableBody = document.getElementById("transaction-table-body");
    const totalBalanceEl = document.getElementById("total-balance");
    const totalIncomeEl = document.getElementById("total-income");
    const totalExpenseEl = document.getElementById("total-expense");

    function render() {
        const totals = store.getTotals();
        if (totalBalanceEl) totalBalanceEl.textContent = `${totals.balance.toFixed(2)} frw`;
        if (totalIncomeEl) totalIncomeEl.textContent = `${totals.income.toFixed(2)} frw`;
        if (totalExpenseEl) totalExpenseEl.textContent = `${totals.expense.toFixed(2)} frw`;

        if (transactionTableBody) {
            transactionTableBody.innerHTML = "";
            store.transactions.forEach(tx => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${tx.date}</td>
                    <td>${tx.description}</td>
                    <td>${tx.category}</td>
                    <td style="color: ${tx.type === 'income' ? 'var(--primary)' : 'var(--danger)'}">
                        ${tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)} frw
                    </td>
                    <td><button data-id="${tx.id}" class="btn-delete">Delete</button></td>
                `;
                transactionTableBody.appendChild(tr);
            });
        }
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
        });
    }

    if (transactionTableBody) {
        transactionTableBody.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                const id = e.target.getAttribute("data-id");
                store.deleteTransaction(id);
                render();
            }
        });
    }

    render();
});