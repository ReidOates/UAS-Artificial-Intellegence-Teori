/**
 * assets/js/dfa.js
 * 
 * Deterministic Finite Automata (DFA) Engine
 * Academic Project: PNR Validator
 * Format: LLDDLL (L = Letter, D = Digit)
 */

// =========================================================
// STATE DEFINITIONS
// =========================================================
const DFA_STATES = {
    START: 'q0',
    Q1: 'q1',
    Q2: 'q2',
    Q3: 'q3',
    Q4: 'q4',
    Q5: 'q5',
    ACCEPT: 'q6',
    REJECT: 'qReject'
};

// =========================================================
// ERROR CODES
// =========================================================
const ERROR_CODES = {
    E01: 'E01 Character 1 must be Letter',
    E02: 'E02 Character 2 must be Letter',
    E03: 'E03 Character 3 must be Digit',
    E04: 'E04 Character 4 must be Digit',
    E05: 'E05 Character 5 must be Letter',
    E06: 'E06 Character 6 must be Letter',
    E07: 'E07 Input Length must equal six'
};

// =========================================================
// DFA ENGINE CLASS
// =========================================================
class PNR_DFA {
    constructor() {
        this.startState = DFA_STATES.START;
        this.acceptState = DFA_STATES.ACCEPT;
    }

    /**
     * Validates if a character is a letter from the alphabet (A-Z)
     * @param {string} char 
     * @returns {boolean}
     */
    isLetter(char) {
        return /^[a-zA-Z]$/.test(char);
    }

    /**
     * Validates if a character is a digit from the alphabet (0-9)
     * @param {string} char 
     * @returns {boolean}
     */
    isDigit(char) {
        return /^[0-9]$/.test(char);
    }

    /**
     * Core Transition Function (δ)
     * Maps State x Input -> Next State
     * 
     * @param {string} currentState - The current node in the DFA
     * @param {string} char - The current input character to process
     * @returns {Object} { nextState, errorCode }
     */
    transition(currentState, char) {
        switch (currentState) {
            case DFA_STATES.START: // q0 -> q1 (Requires Letter)
                return this.isLetter(char) 
                    ? { nextState: DFA_STATES.Q1, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E01' };

            case DFA_STATES.Q1: // q1 -> q2 (Requires Letter)
                return this.isLetter(char) 
                    ? { nextState: DFA_STATES.Q2, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E02' };

            case DFA_STATES.Q2: // q2 -> q3 (Requires Digit)
                return this.isDigit(char) 
                    ? { nextState: DFA_STATES.Q3, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E03' };

            case DFA_STATES.Q3: // q3 -> q4 (Requires Digit)
                return this.isDigit(char) 
                    ? { nextState: DFA_STATES.Q4, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E04' };

            case DFA_STATES.Q4: // q4 -> q5 (Requires Letter)
                return this.isLetter(char) 
                    ? { nextState: DFA_STATES.Q5, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E05' };

            case DFA_STATES.Q5: // q5 -> q6 (Requires Letter)
                return this.isLetter(char) 
                    ? { nextState: DFA_STATES.ACCEPT, errorCode: null } 
                    : { nextState: DFA_STATES.REJECT, errorCode: 'E06' };

            // If it's already in Accept state (and gets more input) or Reject state
            case DFA_STATES.ACCEPT:
            case DFA_STATES.REJECT:
            default:
                return { nextState: DFA_STATES.REJECT, errorCode: null };
        }
    }

    /**
     * Execution Trace Generator
     * Iterates over the string to simulate the Automata execution.
     * 
     * @param {string} input - The PNR string to process
     * @returns {Object} Execution metrics (isValid, trace[], finalState, error)
     */
    process(input) {
        // Sanitize input to handle uppercase gracefully within alphabet Σ
        const sanitizedInput = (input || '').toUpperCase();
        
        let currentState = this.startState;
        const trace = [];
        let rootError = null;

        // Process each character through the transition function
        for (let i = 0; i < sanitizedInput.length; i++) {
            const char = sanitizedInput[i];
            const { nextState, errorCode } = this.transition(currentState, char);

            // Record the transition step
            trace.push({
                step: i + 1,
                inputChar: char,
                fromState: currentState,
                toState: nextState,
                error: errorCode ? ERROR_CODES[errorCode] : null
            });

            currentState = nextState;

            // Capture the first error encountered for the final report
            if (errorCode && !rootError) {
                rootError = ERROR_CODES[errorCode];
            }
        }

        // Validate constraint: Input length must exactly equal six (E07)
        if (sanitizedInput.length !== 6) {
            if (!rootError) {
                rootError = ERROR_CODES.E07;
            }
            
            // If the input was too long, currentState naturally falls to qReject.
            // If the input was too short, currentState never reaches q6 (Accept).
        }

        // Final verification check
        const isValid = (currentState === this.acceptState && sanitizedInput.length === 6);

        return {
            originalInput: sanitizedInput,
            isValid: isValid,
            finalState: currentState,
            errorCode: isValid ? null : rootError,
            executionTrace: trace
        };
    }
}

// Instantiate engine for global/module use
const dfaEngine = new PNR_DFA();