/**
 * assets/js/ui.js
 * 
 * UI Integration Layer, History & Execution Trace
 * Academic Project: PNR Validator
 */

class UIController {
    constructor() {
        // Form & Inputs
        this.form = document.getElementById('pnr-form');
        this.input = document.getElementById('pnr-input');
        
        // Buttons
        this.resetBtn = document.getElementById('btn-reset');
        this.copyBtn = document.getElementById('btn-copy');
        
        // Result Display Elements
        this.resultContainer = document.getElementById('validation-result');
        this.resultStatus = document.getElementById('result-status');
        this.resultMessage = document.getElementById('result-message');
        this.errorBadge = document.getElementById('error-code-badge');
        
        // Trace Elements
        this.traceTimeline = document.getElementById('trace-timeline');
        this.currentStateBadge = document.getElementById('current-state-badge');
        
        // History Elements
        this.historyContainer = document.getElementById('validation-history');
        this.historyList = document.getElementById('history-list');
        
        // State & Utilities
        this.lastValidationResult = null;
        this.dfaVisualizer = new DFAVisualizer('dfa-diagram-container');
        this.historyManager = new ValidationHistory();
        
        this.setupHistoryHeader();
    }

    init() {
        // Event Listeners
        this.form.addEventListener('submit', (e) => this.handleValidation(e));
        this.resetBtn.addEventListener('click', () => this.handleReset());
        this.copyBtn.addEventListener('click', () => this.handleCopy());
        
        // Auto-uppercase input handling
        this.input.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        
        // Render initial history from LocalStorage
        this.renderHistory();
    }

    setupHistoryHeader() {
        // Dynamically inject the "Clear History" button into the existing HTML structure
        const header = this.historyContainer.querySelector('h3');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';

        this.clearHistoryBtn = document.createElement('button');
        this.clearHistoryBtn.className = 'btn secondary-btn';
        this.clearHistoryBtn.style.padding = '0.2rem 0.5rem';
        this.clearHistoryBtn.style.fontSize = '0.75rem';
        this.clearHistoryBtn.textContent = 'Clear History';
        
        this.clearHistoryBtn.addEventListener('click', () => this.handleClearHistory());
        header.appendChild(this.clearHistoryBtn);
    }

    async handleValidation(e) {
        e.preventDefault(); 
        
        const pnrValue = this.input.value.trim();
        if (!pnrValue) return;

        // Disable input and button during animation
        this.input.disabled = true;
        document.getElementById('btn-validate').disabled = true;

        // Execute Validation
        const result = Validator.validatePNR(pnrValue);
        this.lastValidationResult = result;
        
        // Save to History & Render
        this.historyManager.addEntry(result);
        this.renderHistory();
        
        // Update UI
        this.displayResult(result);
        this.displayTrace(result.executionTrace, result.finalState, result.errorCode);
        
        // Trigger smooth interactive diagram animation
        await this.dfaVisualizer.animateTrace(result.executionTrace);

        // Re-enable inputs
        this.input.disabled = false;
        document.getElementById('btn-validate').disabled = false;
        this.input.focus();
    }

    handleReset() {
        // Reset purely the active validation state without touching history
        this.form.reset();
        this.lastValidationResult = null;
        
        this.resultContainer.classList.add('hidden');
        this.errorBadge.classList.add('hidden');
        
        this.currentStateBadge.textContent = 'q0';
        this.traceTimeline.innerHTML = '<p class="placeholder-text">Input a PNR to view step-by-step state transitions.</p>';
        
        this.dfaVisualizer.reset();
    }

    handleCopy() {
        if (!this.lastValidationResult) return;
        
        const { input, isValid, errorMessage } = this.lastValidationResult;
        const copyText = `PNR: ${input} | Status: ${isValid ? 'VALID' : 'INVALID'}` + 
                         (errorMessage ? ` | Error: ${errorMessage}` : '');
        
        navigator.clipboard.writeText(copyText)
            .then(() => alert('Result copied to clipboard!'))
            .catch(err => console.error('Failed to copy', err));
    }

    handleClearHistory() {
        this.historyManager.clearHistory();
        this.renderHistory();
    }

    renderHistory() {
        const history = this.historyManager.getHistory();
        this.historyList.innerHTML = '';
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<li class="history-empty">No history available yet.</li>';
            this.clearHistoryBtn.classList.add('hidden');
            return;
        }

        this.clearHistoryBtn.classList.remove('hidden');
        
        // Build history DOM nodes
        history.forEach(item => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '0.5rem';
            li.style.borderBottom = '1px solid var(--border-color)';
            
            const timeStr = Utils.formatTime(item.timestamp);
            const statusColor = item.isValid ? 'var(--success)' : 'var(--error)';
            const statusLabel = item.isValid ? 'Valid' : `${item.errorCode}`;

            li.innerHTML = `
                <span style="font-weight: 600; font-family: monospace; font-size: 1.1rem; color: var(--text-main);">${item.input}</span>
                <div style="text-align: right;">
                    <span class="badge" style="background-color: transparent; color: ${statusColor}; border: 1px solid ${statusColor}; padding: 0.1rem 0.4rem;">${statusLabel}</span>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${timeStr}</span>
                </div>
            `;
            this.historyList.appendChild(li);
        });
    }

    displayResult(result) {
        this.resultContainer.classList.remove('hidden');
        
        if (result.isValid) {
            this.resultStatus.textContent = 'Status: Valid PNR';
            this.resultStatus.style.color = 'var(--success)';
            this.resultMessage.textContent = `The input "${result.input}" successfully matched the DFA accept state.`;
            this.errorBadge.classList.add('hidden');
        } else {
            this.resultStatus.textContent = 'Status: Invalid PNR';
            this.resultStatus.style.color = 'var(--error)';
            this.resultMessage.textContent = `The input "${result.input}" failed DFA validation.`;
            
            if (result.errorMessage) {
                this.errorBadge.textContent = result.errorMessage;
                this.errorBadge.classList.remove('hidden');
            }
        }
    }

    displayTrace(trace, finalState, errorCode) {
        this.currentStateBadge.textContent = finalState;
        this.traceTimeline.innerHTML = '';
        
        if (!trace || trace.length === 0) {
            this.traceTimeline.innerHTML = '<p class="placeholder-text">No transitions recorded.</p>';
            return;
        }

        const traceContainer = document.createElement('div');
        traceContainer.style.width = '100%';
        traceContainer.style.textAlign = 'left';
        traceContainer.style.fontFamily = 'monospace';
        traceContainer.style.fontSize = '1.1rem';
        traceContainer.style.lineHeight = '2';

        trace.forEach(step => {
            const stepDiv = document.createElement('div');
            let traceText = `${step.fromState} --${step.inputChar}--> ${step.toState}`;
            
            if (step.toState === 'qReject' && step.error) {
                traceText += ` <span style="color: var(--error); font-size: 0.9rem; font-family: var(--font-family);">[${step.error}]</span>`;
            }

            stepDiv.innerHTML = traceText;
            traceContainer.appendChild(stepDiv);
        });

        if (errorCode === 'E07') {
            const lengthErrorDiv = document.createElement('div');
            lengthErrorDiv.innerHTML = `<span style="color: var(--warning); font-size: 0.9rem; font-family: var(--font-family);">[E07 Input Length must equal six]</span>`;
            traceContainer.appendChild(lengthErrorDiv);
        }

        const finalStateDiv = document.createElement('div');
        finalStateDiv.style.marginTop = '1rem';
        finalStateDiv.style.paddingTop = '1rem';
        finalStateDiv.style.borderTop = '1px solid var(--border-color)';
        finalStateDiv.style.fontFamily = 'var(--font-family)';
        finalStateDiv.style.fontWeight = '600';
        
        if (finalState === 'q6' && !errorCode) {
            finalStateDiv.innerHTML = `Final State: <span style="color: var(--success);">${finalState} (Accept)</span>`;
        } else {
            finalStateDiv.innerHTML = `Final State: <span style="color: var(--error);">${finalState} (Reject)</span>`;
        }
        
        traceContainer.appendChild(finalStateDiv);
        this.traceTimeline.appendChild(traceContainer);
    }
}

// Instantiate globally
const uiController = new UIController();