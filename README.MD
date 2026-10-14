# Student Finance TrackerProject

 *Overview*
 
 The Student Finance Tracker is a comprehensive, production-grade web application designed to help students record, monitor, and analyze financial transactions. Built with vanilla JavaScript (ES6+ modules), modern CSS3 with a custom dark-mode glassmorphic theme, and semantic HTML5, the application fulfills rigorous summative assessment requirements (Milestones 1 through 7). It emphasizes modular architecture, input validation via regular expressions, safe search execution, robust error handling, and full accessibility (A11y) compliance.

---
## Features
* **Modular JavaScript Architecture:** Clean separation of concerns across dedicated modules for storage (`storage.js`), state management (`state.js`), UI rendering (`ui.js`), regex validation (`validators.js`), and safe searching (`search.js`).
* **Regex-Powered Form Validation:** Real-time form input validation with descriptive inline error messages and advanced pattern detection (such as duplicate adjacent words).
* **Interactive Data Grid:** Sort records by date, description (A–Z), and numeric amount ($\uparrow\downarrow$), alongside full inline editing and deletion.
* **Stats Dashboard & Budget Cap:** Real-time summary metrics tracking total records, total sum, and budget targets with dynamic **ARIA live region** updates.
* **Safe Regex Search & Highlighting:** Compiles user search queries safely within a `try/catch` block and dynamically wraps matching text inside `<mark>` tags.
* **Persistence & Settings:** Automatic synchronization with `localStorage`, complete JSON import/export handling, and manual currency configuration.

---

## Setup & Installation
 Clone the repository:
 
   git clone [https://github.com/Hodali-1/Student-Finance-Tracker.git]