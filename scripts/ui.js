import { state } from './state.js';
import { validateRecord } from './validators.js';
import { compileRegex, highlight } from './search.js';

let currentSortField = 'date';
let currentSortDirection = 'desc';

export function initUI() {
  setupEventListeners();
  renderApp();
}

function setupEventListeners() {
  const form = document.getElementById('transaction-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderApp());
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const [field, dir] = e.target.value.split('-');
      currentSortField = field;
      currentSortDirection = dir || 'asc';
      renderApp();
    });
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById('record-id');
  const description = document.getElementById('description-input').value.trim();
  const amount = document.getElementById('amount-input').value;
  const category = document.getElementById('category-input').value.trim();
  const date = document.getElementById('date-input').value;

  const recordData = { description, amount: parseFloat(amount), category, date };
  
  // Validate using validators.js logic
  const validation = validateRecord(recordData);
  const errorContainer = document.getElementById('form-error-msg');

  if (!validation.isValid) {
    if (errorContainer) {
      errorContainer.textContent = Object.values(validation.errors)[0];
      errorContainer.setAttribute('role', 'status');
    }
    return;
  }

  if (errorContainer) errorContainer.textContent = '';

  const editId = idInput ? idInput.value : '';
  if (editId) {
    state.updateRecord(editId, recordData);
    idInput.value = '';
  } else {
    state.addRecord(recordData);
  }

  e.target.reset();
  renderApp();
}

export function renderApp() {
  renderTable();
  updateStatsDashboard();
}

function renderTable() {
  const tbody = document.getElementById('records-tbody');
  if (!tbody) return;

  const searchInput = document.getElementById('search-input');
  const query = searchInput ? searchInput.value : '';
  const regex = compileRegex(query);

  // Filter records using regex search
  let filtered = state.records.filter(rec => {
    if (!regex) return true;
    return regex.test(rec.description) || regex.test(rec.category) || regex.test(String(rec.amount)) || regex.test(rec.date);
  });

  // Sort records
  filtered.sort((a, b) => {
    let valA = a[currentSortField];
    let valB = b[currentSortField];

    if (currentSortField === 'amount') {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    }

    if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No records found.</td></tr>`;
    return;
  }

  filtered.forEach(rec => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${highlight(rec.date, regex)}</td>
      <td>${highlight(rec.description, regex)}</td>
      <td>${state.currency} ${highlight(Number(rec.amount).toFixed(2), regex)}</td>
      <td><span class="badge">${highlight(rec.category, regex)}</span></td>
      <td>
        <button class="btn-edit" data-id="${rec.id}">Edit</button>
        <button class="btn-delete" data-id="${rec.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Bind edit and delete actions
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (confirm('Are you sure you want to delete this record?')) {
        state.deleteRecord(e.target.dataset.id);
        renderApp();
      }
    });
  });

  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const record = state.records.find(r => r.id === e.target.dataset.id);
      if (record) {
        document.getElementById('record-id').value = record.id;
        document.getElementById('description-input').value = record.description;
        document.getElementById('amount-input').value = record.amount;
        document.getElementById('category-input').value = record.category;
        document.getElementById('date-input').value = record.date;
      }
    });
  });
}

export function updateStatsDashboard() {
  const totalRecords = state.records.length;
  const totalSum = state.records.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  
  const totalCountEl = document.getElementById('stat-total-count');
  const totalSumEl = document.getElementById('stat-total-sum');
  if (totalCountEl) totalCountEl.textContent = totalRecords;
  if (totalSumEl) totalSumEl.textContent = `${state.currency} ${totalSum.toFixed(2)}`;

  // Budget Cap & ARIA live region update
  const liveRegion = document.getElementById('budget-live-region');
  if (liveRegion) {
    if (totalSum > state.budgetCap) {
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.textContent = `Alert: Budget cap exceeded by ${totalSum - state.budgetCap}!`;
    } else {
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.textContent = `Status: Within budget cap.`;
    }
  }
}