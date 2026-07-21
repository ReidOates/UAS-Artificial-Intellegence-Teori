/**
 * assets/js/app.js
 * 
 * Main Application Entry Point
 * Academic Project: PNR Validator
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the UI Controller
    if (typeof uiController !== 'undefined') {
        uiController.init();
        console.log('PNR Validator: Application Initialized Successfully.');
    } else {
        console.error('PNR Validator: UI Controller is not defined.');
    }
});