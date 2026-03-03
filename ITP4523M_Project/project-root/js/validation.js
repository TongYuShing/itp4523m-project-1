/**
 * ========================================
 * Premium Living Furniture - Form Validation
 * Author: Premium Living Team
 * Version: 1.0
 * ========================================
 */

// Validation rules object
const ValidationRules = {
    required: {
        validate: (value) => value !== undefined && value !== null && value.toString().trim() !== '',
        message: 'This field is required'
    },

    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },

    phone: {
        validate: (value) => /^[\d\s\-\+\(\)]{10,}$/.test(value),
        message: 'Please enter a valid phone number'
    },

    url: {
        validate: (value) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value),
        message: 'Please enter a valid URL'
    },

    number: {
        validate: (value) => !isNaN(value) && isFinite(value),
        message: 'Please enter a valid number'
    },

    integer: {
        validate: (value) => Number.isInteger(Number(value)),
        message: 'Please enter a whole number'
    },

    positive: {
        validate: (value) => parseFloat(value) > 0,
        message: 'Please enter a positive number'
    },

    min: {
        validate: (value, min) => parseFloat(value) >= min,
        message: (min) => `Value must be at least ${min}`
    },

    max: {
        validate: (value, max) => parseFloat(value) <= max,
        message: (max) => `Value must be at most ${max}`
    },

    minLength: {
        validate: (value, min) => value.length >= min,
        message: (min) => `Must be at least ${min} characters`
    },

    maxLength: {
        validate: (value, max) => value.length <= max,
        message: (max) => `Must be at most ${max} characters`
    },

    pattern: {
        validate: (value, pattern) => new RegExp(pattern).test(value),
        message: 'Please match the requested format'
    },

    match: {
        validate: (value, fieldId) => {
            const field = document.getElementById(fieldId);
            return field && value === field.value;
        },
        message: 'Values do not match'
    },

    date: {
        validate: (value) => !isNaN(Date.parse(value)),
        message: 'Please enter a valid date'
    },

    future: {
        validate: (value) => new Date(value) > new Date(),
        message: 'Date must be in the future'
    },

    past: {
        validate: (value) => new Date(value) < new Date(),
        message: 'Date must be in the past'
    },

    creditCard: {
        validate: (value) => {
            const cleaned = value.replace(/\D/g, '');
            return /^\d{13,19}$/.test(cleaned) && luhnCheck(cleaned);
        },
        message: 'Please enter a valid credit card number'
    },

    cvv: {
        validate: (value) => /^\d{3,4}$/.test(value),
        message: 'Please enter a valid CVV'
    },

    postalCode: {
        validate: (value) => /^[A-Za-z0-9\s\-]{3,10}$/.test(value),
        message: 'Please enter a valid postal code'
    },

    password: {
        validate: (value) => {
            const strength = checkPasswordStrength(value);
            return strength >= 3;
        },
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    }
};

/**
 * Luhn algorithm for credit card validation
 */
function luhnCheck(number) {
    let sum = 0;
    let alternate = false;

    for (let i = number.length - 1; i >= 0; i--) {
        let n = parseInt(number.charAt(i), 10);

        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }

        sum += n;
        alternate = !alternate;
    }

    return sum % 10 === 0;
}

/**
 * Check password strength
 */
function checkPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return score;
}

/**
 * Form Validator Class
 */
class FormValidator {
    constructor(form, options = {}) {
        this.form = form;
        this.options = {
            validateOnBlur: true,
            validateOnInput: true,
            showErrors: true,
            ...options
        };

        this.errors = new Map();
        this.init();
    }

    init() {
        // Add novalidate to prevent browser validation
        this.form.setAttribute('novalidate', 'novalidate');

        // Get all fields with validation rules
        this.fields = this.form.querySelectorAll('[data-validate]');

        // Bind events
        if (this.options.validateOnBlur) {
            this.fields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
            });
        }

        if (this.options.validateOnInput) {
            this.fields.forEach(field => {
                field.addEventListener('input', () => {
                    if (field.classList.contains('error')) {
                        this.validateField(field);
                    }
                });
            });
        }

        // Form submit handler
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
                this.showFirstError();
            }
        });
    }

    /**
     * Validate all fields
     */
    validate() {
        let isValid = true;
        this.errors.clear();

        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate single field
     */
    validateField(field) {
        const rules = field.getAttribute('data-validate').split(' ');
        const value = field.value;
        let isValid = true;
        let errorMessage = '';

        for (const rule of rules) {
            const [ruleName, ...params] = rule.split(':');

            if (ValidationRules[ruleName]) {
                const ruleConfig = ValidationRules[ruleName];
                const param = params.join(':');

                let ruleValid;
                if (param) {
                    ruleValid = ruleConfig.validate(value, param);
                } else {
                    ruleValid = ruleConfig.validate(value);
                }

                if (!ruleValid) {
                    isValid = false;
                    errorMessage = typeof ruleConfig.message === 'function'
                        ? ruleConfig.message(param)
                        : ruleConfig.message;
                    break;
                }
            }
        }

        this.updateFieldStatus(field, isValid, errorMessage);

        if (!isValid) {
            this.errors.set(field, errorMessage);
        } else {
            this.errors.delete(field);
        }

        return isValid;
    }

    /**
     * Update field UI based on validation
     */
    updateFieldStatus(field, isValid, errorMessage) {
        field.classList.toggle('error', !isValid);
        field.classList.toggle('success', isValid);

        if (this.options.showErrors) {
            let errorElement = field.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }

            errorElement.textContent = isValid ? '' : errorMessage;
            errorElement.style.display = isValid ? 'none' : 'block';
        }
    }

    /**
     * Show first error field
     */
    showFirstError() {
        if (this.errors.size > 0) {
            const firstError = this.errors.keys().next().value;
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Clear all errors
     */
    clearErrors() {
        this.errors.clear();
        this.fields.forEach(field => {
            field.classList.remove('error', 'success');
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        });
    }

    /**
     * Reset form
     */
    reset() {
        this.form.reset();
        this.clearErrors();
    }
}

/**
 * Initialize validation on all forms
 */
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-validate-form]');

    forms.forEach(form => {
        const options = {
            validateOnBlur: form.getAttribute('data-validate-on-blur') !== 'false',
            validateOnInput: form.getAttribute('data-validate-on-input') !== 'false',
            showErrors: form.getAttribute('data-show-errors') !== 'false'
        };

        new FormValidator(form, options);
    });
});

// Export for use in other modules
window.FormValidator = FormValidator;
window.ValidationRules = ValidationRules;