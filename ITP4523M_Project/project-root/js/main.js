/**
 * ========================================
 * Premium Living Furniture - Main JavaScript
 * Author: Premium Living Team
 * Version: 1.0
 * ========================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main initialization function
 */
function initializeApp() {
    initializeNavigation();
    initializeForms();
    initializeModals();
    initializeDropdowns();
    initializeTooltips();
    initializeSearch();
    initializeTheme();
    loadUserPreferences();
    setupEventListeners();
}

/**
 * ========================================
 * NAVIGATION & UI COMPONENTS
 * ========================================
 */

/**
 * Initialize navigation components
 */
function initializeNavigation() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('open');
            if (menuOverlay) {
                menuOverlay.classList.toggle('open');
            }
        });
    }

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            menuOverlay.classList.remove('open');
        });
    }

    // Active link highlighting
    highlightCurrentPage();
}

/**
 * Highlight current page in navigation
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a, .menu-item');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '#') {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        if (toggle && menu) {
            // Toggle on click
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                menu.classList.toggle('show');
            });

            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
        }
    });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(element => {
        const text = element.getAttribute('data-tooltip');

        element.addEventListener('mouseenter', function(e) {
            showTooltip(e.target, text);
        });

        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

/**
 * Show tooltip
 */
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = text;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';

    const rect = element.getBoundingClientRect();
    tooltip.style.top = rect.top - 30 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) - 50 + 'px';

    document.body.appendChild(tooltip);

    // Remove after 2 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 2000);
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip-popup');
    tooltips.forEach(tooltip => tooltip.remove());
}

/**
 * ========================================
 * FORM HANDLING
 * ========================================
 */

/**
 * Initialize form components
 */
function initializeForms() {
    initializeFormValidation();
    initializePasswordToggle();
    initializeFileUpload();
    initializeCharacterCounters();
    initializeAutoComplete();
}

/**
 * Form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // Real-time validation on blur
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validate single field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.getAttribute('type');
    const errorElement = getOrCreateErrorElement(field);

    // Remove existing error class
    field.classList.remove('error', 'success');

    // Check if empty and required
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Validate email
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Validate phone
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }

    // Validate password strength
    if (field.classList.contains('password-strength') && value) {
        const strength = checkPasswordStrength(value);
        updatePasswordStrengthIndicator(field, strength);
    }

    // Field is valid
    field.classList.add('success');
    if (errorElement) {
        errorElement.remove();
    }

    return true;
}

/**
 * Show field error message
 */
function showFieldError(field, message) {
    field.classList.add('error');

    const errorElement = getOrCreateErrorElement(field);
    errorElement.textContent = message;
    errorElement.className = 'form-error';

    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

/**
 * Get or create error element for field
 */
function getOrCreateErrorElement(field) {
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('form-error')) {
        errorElement = document.createElement('div');
    }
    return errorElement;
}

/**
 * Check password strength
 */
function checkPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;

    return strength;
}

/**
 * Update password strength indicator
 */
function updatePasswordStrengthIndicator(field, strength) {
    const indicator = document.querySelector('.password-strength-meter');
    if (!indicator) return;

    const bars = indicator.querySelectorAll('.strength-bar');
    const messages = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

    bars.forEach((bar, index) => {
        if (index < strength) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });

    const message = indicator.querySelector('.strength-message');
    if (message) {
        message.textContent = messages[strength - 1] || '';
    }
}

/**
 * Initialize password toggle visibility
 */
function initializePasswordToggle() {
    const toggles = document.querySelectorAll('.password-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    });
}

/**
 * Initialize file upload preview
 */
function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"][data-preview]');

    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const previewId = this.getAttribute('data-preview');
            const preview = document.getElementById(previewId);

            if (preview && this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    if (preview.tagName === 'IMG') {
                        preview.src = e.target.result;
                    } else {
                        preview.innerHTML = `<img src="${e.target.result}" class="preview-image">`;
                    }
                };

                reader.readAsDataURL(this.files[0]);
            }
        });
    });
}

/**
 * Initialize character counters
 */
function initializeCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[data-maxlength]');

    textareas.forEach(textarea => {
        const maxlength = parseInt(textarea.getAttribute('data-maxlength'));
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        textarea.parentNode.appendChild(counter);

        function updateCounter() {
            const remaining = maxlength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 20 ? 'red' : '#666';
        }

        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
}

/**
 * Initialize autocomplete
 */
function initializeAutoComplete() {
    const autocompleteInputs = document.querySelectorAll('[data-autocomplete]');

    autocompleteInputs.forEach(input => {
        const source = input.getAttribute('data-autocomplete');

        input.addEventListener('input', debounce(function() {
            const value = this.value;
            if (value.length < 2) return;

            // Fetch suggestions
            fetchSuggestions(source, value, suggestions => {
                showAutocompleteSuggestions(this, suggestions);
            });
        }, 300));
    });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show autocomplete suggestions
 */
function showAutocompleteSuggestions(input, suggestions) {
    // Remove existing suggestions
    const existing = document.querySelector('.autocomplete-suggestions');
    if (existing) existing.remove();

    if (!suggestions || suggestions.length === 0) return;

    const container = document.createElement('div');
    container.className = 'autocomplete-suggestions';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = suggestion;
        item.addEventListener('click', function() {
            input.value = suggestion;
            container.remove();
        });
        container.appendChild(item);
    });

    input.parentNode.appendChild(container);
}

/**
 * ========================================
 * MODAL HANDLING
 * ========================================
 */

/**
 * Initialize modals
 */
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Close buttons
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close on overlay click
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

/**
 * Open modal by ID
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Trigger event
    dispatchEvent('modal:opened', { modalId });
}

/**
 * Close modal by ID
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Trigger event
    dispatchEvent('modal:closed', { modalId });
}

/**
 * ========================================
 * SEARCH FUNCTIONALITY
 * ========================================
 */

/**
 * Initialize search
 */
function initializeSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');

    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            const query = this.value;
            if (query.length >= 2) {
                performSearch(query);
            }
        }, 500));
    });

    const searchButtons = document.querySelectorAll('.search-button');
    searchButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.value) {
                performSearch(input.value);
            }
        });
    });
}

/**
 * Perform search
 */
function performSearch(query) {
    // Dispatch search event
    dispatchEvent('search:performed', { query });

    // Show loading indicator
    showSearchLoading();

    // Simulate search (replace with actual API call)
    setTimeout(() => {
        hideSearchLoading();
        // Handle search results
    }, 500);
}

/**
 * Show search loading indicator
 */
function showSearchLoading() {
    const container = document.querySelector('.search-results');
    if (container) {
        container.innerHTML = '<div class="search-loading">Searching...</div>';
    }
}

/**
 * Hide search loading indicator
 */
function hideSearchLoading() {
    // Implementation depends on UI
}

/**
 * ========================================
 * THEME MANAGEMENT
 * ========================================
 */

/**
 * Initialize theme
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * Set theme
 */
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('theme', theme);

    // Update theme toggle icon if exists
    const toggleIcon = document.querySelector('#theme-toggle i');
    if (toggleIcon) {
        toggleIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    dispatchEvent('theme:changed', { theme });
}

/**
 * ========================================
 * USER PREFERENCES
 * ========================================
 */

/**
 * Load user preferences
 */
function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};

    // Apply saved preferences
    if (preferences.sidebarCollapsed) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('collapsed');
    }

    if (preferences.fontSize) {
        document.documentElement.style.fontSize = preferences.fontSize;
    }

    dispatchEvent('preferences:loaded', preferences);
}

/**
 * Save user preferences
 */
function saveUserPreferences(preferences) {
    const current = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const updated = { ...current, ...preferences };
    localStorage.setItem('userPreferences', JSON.stringify(updated));

    dispatchEvent('preferences:saved', updated);
}

/**
 * ========================================
 * EVENT HANDLERS
 * ========================================
 */

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', debounce(handleResize, 250));

    // Scroll events
    window.addEventListener('scroll', debounce(handleScroll, 100));

    // Online/Offline detection
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Before unload
    window.addEventListener('beforeunload', handleBeforeUnload);
}

/**
 * Handle window resize
 */
function handleResize() {
    // Adjust UI based on screen size
    const width = window.innerWidth;

    if (width < 768) {
        document.body.classList.add('mobile-view');
        document.body.classList.remove('desktop-view');
    } else {
        document.body.classList.remove('mobile-view');
        document.body.classList.add('desktop-view');
    }

    dispatchEvent('resize', { width });
}

/**
 * Handle scroll
 */
function handleScroll() {
    const scrollY = window.scrollY;

    // Add shadow to header when scrolled
    const header = document.querySelector('header');
    if (header) {
        if (scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Back to top button visibility
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}

/**
 * Handle online status
 */
function handleOnline() {
    showNotification('You are back online!', 'success');
    dispatchEvent('connection:online');
}

/**
 * Handle offline status
 */
function handleOffline() {
    showNotification('You are offline. Some features may be unavailable.', 'warning');
    dispatchEvent('connection:offline');
}

/**
 * Handle before unload
 */
function handleBeforeUnload(e) {
    // Check for unsaved changes
    if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
    }
}

/**
 * Check for unsaved changes
 */
function hasUnsavedChanges() {
    const dirtyForms = document.querySelectorAll('form.dirty');
    return dirtyForms.length > 0;
}

/**
 * ========================================
 * NOTIFICATIONS
 * ========================================
 */

/**
 * Show notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas fa-${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    container.appendChild(notification);

    // Add to queue
    notificationQueue.push(notification);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => {
            dismissNotification(notification);
        }, duration);
    }

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        dismissNotification(notification);
    });
}

/**
 * Dismiss notification
 */
function dismissNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        // Remove from queue
        const index = notificationQueue.indexOf(notification);
        if (index > -1) notificationQueue.splice(index, 1);
    }, 300);
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Notification queue
const notificationQueue = [];

/**
 * ========================================
 * DATA MANAGEMENT
 * ========================================
 */

/**
 * Fetch data from API
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Error loading data. Please try again.', 'error');
        return { success: false, error };
    }
}

/**
 * Post data to API
 */
async function postData(url, data) {
    return fetchData(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Update data via API
 */
async function updateData(url, data) {
    return fetchData(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Delete data via API
 */
async function deleteData(url) {
    return fetchData(url, {
        method: 'DELETE'
    });
}

/**
 * ========================================
 * UTILITY FUNCTIONS
 * ========================================
 */

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(date, format = 'short') {
    const d = new Date(date);
    const options = {
        short: { month: 'numeric', day: 'numeric', year: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric' },
        full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Format number with commas
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate random ID
 */
function generateId(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 9);
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy', 'error');
    });
}

/**
 * Download file
 */
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Dispatch custom event
 */
function dispatchEvent(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
}

/**
 * ========================================
 * EXPORT FUNCTIONS FOR GLOBAL USE
 * ========================================
 */
window.PremiumLiving = {
    // Core
    showNotification,
    formatCurrency,
    formatDate,
    formatNumber,
    copyToClipboard,
    downloadFile,

    // Data
    fetchData,
    postData,
    updateData,
    deleteData,

    // UI
    openModal,
    closeModal,
    toggleTheme,

    // Utility
    generateId,
    debounce
};