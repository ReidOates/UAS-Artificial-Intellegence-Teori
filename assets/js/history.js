/**
 * assets/js/history.js
 * 
 * LocalStorage History Manager
 * Academic Project: PNR Validator
 */

class ValidationHistory {
    constructor() {
        this.storageKey = 'pnr_validation_history';
        this.maxEntries = 15; // Limit to prevent unlimited storage growth
    }

    /**
     * Retrieves the history array from LocalStorage
     * @returns {Array} Array of validation result objects
     */
    getHistory() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Adds a new validation result to history
     * @param {Object} result - The validation result object
     */
    addEntry(result) {
        const history = this.getHistory();
        
        const entry = {
            input: result.input,
            isValid: result.isValid,
            errorCode: result.errorCode,
            timestamp: new Date().toISOString()
        };
        
        // Add to the beginning of the array
        history.unshift(entry);
        
        // Enforce maximum entries limit
        if (history.length > this.maxEntries) {
            history.pop();
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(history));
    }

    /**
     * Wipes all validation history from LocalStorage
     */
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}