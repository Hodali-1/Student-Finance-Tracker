# Student Finance Tracker

## Overview
The **Student Finance Tracker** is a high-performance, fully responsive web application built for students to manage, track, and analyze personal financial records securely and efficiently. Featuring a modern dark-mode glassmorphism interface, it provides real-time validation, dynamic budgeting alerts, and modular architecture.

* **Theme:** Student Finance Tracker
* **Live Demo URL:** <https://github.com/Hodali-1/Student-Finance-Tracker.git
* **Demo Video Walkthrough:** 

# Student Finance Tracker

## Overview
The **Student Finance Tracker** is a high-performance, fully responsive web application engineered for students to manage, track, and analyze personal financial records securely, efficiently, and with advanced accessibility compliance. Designed around a modern dark-mode glassmorphic aesthetic using **Space Grotesk** and **JetBrains Mono** typography, the application bridges robust state management with an intuitive user experience.

---

## Architecture & Modular Design
To ensure maintainability, scalability, and clean separation of concerns, the application is built using **Vanilla ES6+ JavaScript modules**:


<text
├── index.html              # Semantic HTML markup & layout structure
├── tests.html              # Automated assertion test suite
├── seed.json               # Initial robust seed records (large amounts, edge dates, tricky strings)
├── styles/
│   └── style.css           # Custom CSS3 dark-mode theme, glassmorphism, & 3 breakpoints
└── scripts/
    ├── storage.js          # Handles localStorage persistence and JSON export/import
    ├── state.js            # Centralized application state manager and reactive data flow
    ├── validators.js       # Regular expression rule engine and inline error handlers
    ├── search.js           # Safe regex compiler with real-time text matching & <mark highlighting
    └── ui.js               # DOM rendering, event delegation, sorting, inline editing, & ARIA alerts >

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
 
   git clone https://github.com/Hodali-1/Student-Finance-Tracker.git
