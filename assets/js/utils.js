/**
 * assets/js/utils.js
 * 
 * General Utility Functions
 * Academic Project: PNR Validator
 */

class Utils {
    /**
     * Formats a date object into a readable time string (e.g., "14:30:05")
     * @param {Date|string} dateString 
     * @returns {string} Formatted time string
     */
    static formatTime(dateString) {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(date);
    }
}