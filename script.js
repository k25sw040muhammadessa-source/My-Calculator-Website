/* ========================================
   CALCULATOR JAVASCRIPT
   ======================================== */

class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;

        this.init();
    }

    init() {
        this.attachEventListeners();
        this.attachKeyboardListeners();
        this.updateDisplay();
    }

    /* ========================================
       EVENT LISTENERS
       ======================================== */
    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNumber(e.target.dataset.number));
        });

        // Operator buttons
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOperator(e.target.dataset.operator));
        });

        // Function buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.target.dataset.action));
        });
    }

    attachKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Numbers
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                this.handleNumber(e.key);
            }
            // Decimal
            if (e.key === '.') {
                e.preventDefault();
                this.handleNumber('.');
            }
            // Operators
            if (e.key === '+') {
                e.preventDefault();
                this.handleOperator('+');
            }
            if (e.key === '-') {
                e.preventDefault();
                this.handleOperator('-');
            }
            if (e.key === '*') {
                e.preventDefault();
                this.handleOperator('*');
            }
            if (e.key === '/' || e.key === ':') {
                e.preventDefault();
                this.handleOperator('/');
            }
            // Enter or equals
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.handleAction('equals');
            }
            // Backspace
            if (e.key === 'Backspace') {
                e.preventDefault();
                this.handleAction('delete');
            }
            // Escape
            if (e.key === 'Escape') {
                e.preventDefault();
                this.handleAction('clear');
            }
        });
    }

    /* ========================================
       CORE CALCULATION LOGIC
       ======================================== */
    handleNumber(num) {
        // Reset display after operator or equals
        if (this.shouldResetDisplay) {
            this.currentInput = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
            this.updateDisplay();
            return;
        }

        // Handle decimal point
        if (num === '.') {
            if (!this.currentInput.includes('.')) {
                this.currentInput += num;
            }
        } else {
            // Replace initial zero
            if (this.currentInput === '0' && num !== '.') {
                this.currentInput = num;
            } else {
                this.currentInput += num;
            }
        }

        this.updateDisplay();
    }

    handleOperator(op) {
        // If we already have an operator set, calculate first
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    calculate() {
        if (this.operator === null || this.shouldResetDisplay) {
            return;
        }

        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        // Validate inputs
        if (isNaN(prev) || isNaN(current)) {
            return;
        }

        // Perform calculation
        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                // Prevent division by zero
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    this.operator = null;
                    this.shouldResetDisplay = true;
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format result
        this.currentInput = this.formatResult(result);
        this.operator = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'equals':
                this.calculate();
                break;
            case 'percent':
                this.handlePercent();
                break;
        }
    }

    /* ========================================
       UTILITY FUNCTIONS
       ======================================== */
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetDisplay) {
            return;
        }

        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }

        this.updateDisplay();
    }

    handlePercent() {
        if (this.operator === null) {
            const value = parseFloat(this.currentInput);
            this.currentInput = this.formatResult(value / 100);
        } else {
            const prev = parseFloat(this.previousInput);
            const current = parseFloat(this.currentInput);

            // Calculate percentage of previous number
            const percentValue = (prev * current) / 100;
            this.currentInput = this.formatResult(percentValue);
        }

        this.updateDisplay();
    }

    formatResult(value) {
        // Round to 10 decimal places to avoid floating point errors
        const rounded = Math.round(value * 10000000000) / 10000000000;

        // Format to remove unnecessary zeros
        if (rounded % 1 === 0) {
            return rounded.toString();
        } else {
            return rounded.toString();
        }
    }

    updateDisplay() {
        // Format current input with comma separators
        const displayValue = this.currentInput.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        this.display.value = displayValue;

        // Update previous operation display
        const previousOpElement = document.getElementById('previousOperation');
        if (this.operator !== null) {
            const prevValue = this.previousInput.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const operatorSymbols = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            };
            previousOpElement.textContent = prevValue + ' ' + operatorSymbols[this.operator];
        } else {
            previousOpElement.textContent = '';
        }

        // Add visual feedback for display
        this.display.style.transform = 'scale(1)';
        setTimeout(() => {
            this.display.style.transform = 'scale(1)';
        }, 50);
    }
}

/* ========================================
   INITIALIZE CALCULATOR
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();

    // Add animation to calculator on load
    const calculator = document.querySelector('.calculator');
    calculator.style.animation = 'slideUp 0.6s ease-out';

    // Add console message
    console.log('%c⚡Calculator Loaded', 'font-size: 16px; color: #6366f1; font-weight: bold;');
    console.log('%cUse numbers, operators (+, -, *, /), and Enter to calculate', 'color: #cbd5e1;');
});

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('Calculator is ready for interaction');
    });
}