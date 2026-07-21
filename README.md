# PNR Validator

![Version](https://img.shields.io/badge/version-1.0_Final-blue)
![Tech Stack](https://img.shields.io/badge/tech-HTML5_|_CSS3_|_Vanilla_JS-success)
![License](https://img.shields.io/badge/license-MIT-green)

**Passenger Name Record (PNR) Validation using Deterministic Finite Automata (DFA)**

An academic project developed for **Universitas Bale Bandung**.

---

## 📖 Project Description

The **PNR Validator** is a web-based application designed to simulate and validate Passenger Name Records (PNR) strictly using Automata Theory. Rather than relying on standard Regular Expressions, the core validation engine is built entirely on a **Deterministic Finite Automaton (DFA)**. 

The application ensures that an input string conforms to a simulated 6-character alphanumeric aviation reservation format: **LLDDLL** (Letter-Letter-Digit-Digit-Letter-Letter).

### Key Features
*   **Pure DFA Engine:** Computes state transitions step-by-step.
*   **Execution Trace:** Visualizes the exact path `q0 --L--> q1`, pinpointing structural failures.
*   **Interactive State Diagram:** Real-time SVG-based animation of node and edge transitions.
*   **Validation History:** LocalStorage persistence for tracking recent tests.
*   **Modern UI:** Accessible, responsive SaaS dark theme utilizing semantic HTML and CSS variables.

---

## 📸 Screenshots

| Validator Interface | Execution Trace & History |
| :---: | :---: |
| ![Validator UI](docs/screenshots/validator.png) <br> *Placeholder: Add validator.png to docs/screenshots/* | ![Execution Trace](docs/screenshots/trace.png) <br> *Placeholder: Add trace.png to docs/screenshots/* |
| **Interactive DFA Graph** | **Theory & Documentation** |
| ![State Diagram](docs/screenshots/diagram.png) <br> *Placeholder: Add diagram.png to docs/screenshots/* | ![Theory Section](docs/screenshots/theory.png) <br> *Placeholder: Add theory.png to docs/screenshots/* |

---

## ⚙️ Deterministic Finite Automata (DFA) Theory

A DFA is defined by the 5-tuple **M = (Q, Σ, δ, q0, F)**:

*   **States (Q):** `{q0, q1, q2, q3, q4, q5, q6, qReject}`
*   **Alphabet (Σ):** `{A-Z, 0-9}`
*   **Start State (q0):** `q0`
*   **Accept State (F):** `{q6}`
*   **Transition Function (δ):** 

| Current State | Input: Letter (L) | Input: Digit (D) |
| :--- | :--- | :--- |
| **→ q0** | q1 | qReject |
| **q1** | q2 | qReject |
| **q2** | qReject | q3 |
| **q3** | qReject | q4 |
| **q4** | q5 | qReject |
| **q5** | **\*q6 (Accept)** | qReject |
| **\*q6** | qReject | qReject |
| **qReject** | qReject | qReject |

*Any deviation routes the engine into the non-escaping `qReject` sink state.*

---

## 🚀 Installation & Usage Guide

Since this project uses Vanilla JavaScript with no external backend, databases, or build tools, installation is instantaneous.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ReidOates/UAS-Artificial-Intellegence-Teori.git](https://github.com/ReidOates/UAS-Artificial-Intellegence-Teori.git)

2.  **Navigate to the directory:**

```bash
    cd pnr-validator
```
3. **Run the application:**
    Simply open index.html in any modern web browser.
    (Optional): Use an extension like Live Server in VSCode for auto-reloading.

🗂️ Project Structure
pnr-validator/
│
├── index.html            # Main semantic HTML structure
├── README.md             # Project documentation
├── LICENSE               # MIT License
├── .gitignore            # Git exclusion rules
│
├── assets/
│   ├── css/              # Modular Stylesheets
│   │   ├── variables.css # Theme tokens
│   │   ├── style.css     # Base styles
│   │   ├── components.css# UI components
│   │   ├── animations.css# Keyframes
│   │   └── responsive.css# Media queries & A11y
│   │
│   └── js/               # Vanilla JavaScript Modules
│       ├── app.js        # Main entry point
│       ├── dfa.js        # Core DFA engine logic
│       ├── validator.js  # Validation orchestrator & Length checks
│       ├── ui.js         # DOM manipulation & Events
│       ├── animation.js  # SVG interactive graph logic
│       ├── history.js    # LocalStorage management
│       └── utils.js      # Helpers (Date formatting)
│
└── docs/                 # Documentation assets
    └── screenshots/      # UI screenshots

🌐 Browser Compatibility
This application uses ES6 Modules, CSS Variables, and Native SVG DOM APIs. It is fully compatible with:

Google Chrome (v80+)

Mozilla Firefox (v75+)

Apple Safari (v13+)

Microsoft Edge (v80+)

📚 References
Automata Theory: Sipser, M. (2012). Introduction to the Theory of Computation (3rd ed.). Cengage Learning.

Academic Institution: Universitas Bale Bandung - Final Project (Teori Bahasa dan Automata / Artificial Intelligence).