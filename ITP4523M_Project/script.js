// DOM Elements
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggle-sidebar');
const sidebarTexts = document.querySelectorAll('.sidebar-text');
const navLinks = document.querySelectorAll('nav ul li a');
const pageTitle = document.getElementById('page-title');
// Section Elements
const dashboardSection = document.getElementById('dashboard-section');
const materialRequestSection = document.getElementById('material-request-section');
const deliveryTrackingSection = document.getElementById('delivery-tracking-section');
const complaintLogSection = document.getElementById('complaint-log-section');
// Forms
const materialRequestForm = document.getElementById('material-request-form');
const complaintForm = document.getElementById('complaint-form');

// Sidebar Toggle (Mobile/Tablet)
toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-20');
    sidebarTexts.forEach(text => text.classList.toggle('hidden'));
});

// Nav Link Active State & Section Switching
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Remove active state from all links
        navLinks.forEach(l => l.classList.remove('sidebar-active'));
        // Add active state to clicked link
        link.classList.add('sidebar-active');
        // Get target section ID
        const target = link.getAttribute('href').substring(1);
        // Update page title
        pageTitle.textContent = link.querySelector('.sidebar-text').textContent;
        // Hide all sections
        hideAllSections();
        // Show target section
        switch(target) {
            case 'dashboard':
                dashboardSection.classList.remove('hidden');
                break;
            case 'material-request':
                materialRequestSection.classList.remove('hidden');
                break;
            case 'delivery-tracking':
                deliveryTrackingSection.classList.remove('hidden');
                break;
            case 'complaint-log':
                complaintLogSection.classList.remove('hidden');
                break;
            default:
                dashboardSection.classList.remove('hidden');
        }
        // Close sidebar on mobile after click
        if (window.innerWidth < 1024) {
            sidebar.classList.remove('w-64');
            sidebar.classList.add('w-20');
            sidebarTexts.forEach(text => text.classList.add('hidden'));
        }
    });
});

// Hide All Sections Helper Function
function hideAllSections() {
    dashboardSection.classList.add('hidden');
    materialRequestSection.classList.add('hidden');
    deliveryTrackingSection.classList.add('hidden');
    complaintLogSection.classList.add('hidden');
}

// Form Validation & Submission (Prototype - No Backend)
if (materialRequestForm) {
    materialRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Material Request Submitted Successfully! (Prototype - No Backend Integration)');
        materialRequestForm.reset();
    });
}

if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Customer Complaint Logged Successfully! (Prototype - No Backend Integration)');
        complaintForm.reset();
    });
}

// Dynamic Request ID (Random Number)
document.addEventListener('DOMContentLoaded', () => {
    const reqIdInput = document.getElementById('req-id');
    if (reqIdInput) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        reqIdInput.value = `MR${randomNum}`;
    }
    // Set minimum date for date inputs to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => input.min = today);
});

// Delivery Search (Prototype)
const searchDelivery = document.getElementById('search-delivery');
const deliverySearch = document.getElementById('delivery-search');
if (searchDelivery && deliverySearch) {
    searchDelivery.addEventListener('click', () => {
        if (deliverySearch.value.trim() === '') {
            alert('Please enter an Order/Delivery Note/Serial Number!');
        } else {
            alert(`Searching for: ${deliverySearch.value} (Prototype - No Backend Integration)`);
        }
    });
}

// Responsive Sidebar on Window Resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');
        sidebarTexts.forEach(text => text.classList.remove('hidden'));
    } else {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');
        sidebarTexts.forEach(text => text.classList.add('hidden'));
    }
});
