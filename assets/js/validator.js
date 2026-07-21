/**
 * assets/js/validator.js
 * 
 * Validation Logic Orchestrator
 * Academic Project: PNR Validator
 */

// =========================================================
// VALIDATION ERROR CODES
// =========================================================
const VALIDATION_ERRORS = {
    E01: 'E01 Character 1 must be Letter',
    E02: 'E02 Character 2 must be Letter',
    E03: 'E03 Character 3 must be Digit',
    E04: 'E04 Character 4 must be Digit',
    E05: 'E05 Character 5 must be Letter',
    E06: 'E06 Character 6 must be Letter',
    E07: 'E07 Input Length must equal six'
};

// =========================================================
// VALIDATOR CLASS
// =========================================================
class Validator {
    /**
     * Executes the full validation pipeline for a given PNR
     * 
     * @param {string} input - The raw string to validate
     * @returns {Object} Structured final validation result
     */
    static validatePNR(input) {
        // Sanitize string
        const sanitizedInput = (input || '').trim().toUpperCase();
        
        // 1. DFA Invocation
        // Leverages the global dfaEngine instance defined in dfa.js
        const dfaResult = dfaEngine.process(sanitizedInput);
        
        // 2. Length Validation
        const isLengthValid = sanitizedInput.length === 6;
        
        // 3. Error Code Generation
        let generatedErrorCode = null;

        // Search the DFA execution trace for structural character violations (E01-E06)
        const trace = dfaResult.executionTrace;
        for (let i = 0; i < trace.length; i++) {
            if (trace[i].toState === 'qReject') {
                // Dynamically map the failed step index (1-6) to its corresponding error code
                generatedErrorCode = `E0${trace[i].step}`;
                break;
            }
        }

        // If no structural violations occurred, but the length is invalid, apply E07
        if (!generatedErrorCode && !isLengthValid) {
            generatedErrorCode = 'E07';
        }

        // Combine logic to determine true validity
        const isFullyValid = (
            isLengthValid && 
            generatedErrorCode === null && 
            dfaResult.finalState === 'q6'
        );

        // 4. Final Validation Result Structure
        return {
            input: sanitizedInput,
            isValid: isFullyValid,
            errorCode: generatedErrorCode,
            errorMessage: generatedErrorCode ? VALIDATION_ERRORS[generatedErrorCode] : null,
            finalState: dfaResult.finalState,
            executionTrace: trace
        };
    }
}