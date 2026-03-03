<?php
// index.php - Protected dashboard
require_once 'config/auth.php';

$auth = new Auth();

// Check if user is logged in
if (!$auth->isLoggedIn()) {
    header('Location: login.php');
    exit();
}

$current_user = $auth->getCurrentUser();

// Handle logout
if (isset($_GET['logout'])) {
    $auth->logout();
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Living Furniture - Dashboard</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Same Tailwind config as before -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#2D3748',
                        secondary: '#8B5A2B',
                        accent: '#E2E8F0',
                        success: '#38A169',
                        warning: '#ECC94B',
                        danger: '#E53E3E',
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                }
            }
        }
    </script>
    <style>
        .sidebar-active {
            @apply bg-secondary/10 text-secondary border-l-4 border-secondary;
        }
        .card-shadow {
            @apply shadow-lg shadow-primary/10;
        }
        .form-input {
            @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary;
        }
        .btn-primary {
            @apply bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-all duration-300;
        }
        .btn-secondary {
            @apply bg-white text-primary border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans text-primary min-h-screen flex flex-col">
    <!-- Main Container -->
    <div class="flex flex-1">
        <!-- Sidebar (same as before) -->
        <aside id="sidebar" class="w-64 bg-primary text-white h-screen fixed lg:sticky top-0 transition-all duration-300 z-30">
            <!-- Company Logo -->
            <div class="p-4 border-b border-gray-700 flex items-center justify-between">
                <h1 class="text-lg font-bold flex items-center gap-2">
                    <i class="fas fa-couch"></i>
                    <span class="sidebar-text">Premium Living</span>
                </h1>
                <button id="toggle-sidebar" class="lg:hidden text-white hover:text-secondary">
                    <i class="fas fa-bars"></i>
                </button>
            </div>

            <!-- User Profile - Dynamic from database -->
            <div class="p-4 border-b border-gray-700 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center">
                    <span class="font-bold"><?php echo strtoupper(substr($current_user['full_name'], 0, 2)); ?></span>
                </div>
                <div class="sidebar-text">
                    <p class="text-sm font-medium"><?php echo htmlspecialchars($current_user['full_name']); ?></p>
                    <p class="text-xs text-gray-400"><?php echo htmlspecialchars($current_user['department'] . ' · ' . $current_user['role']); ?></p>
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="py-4">
                <ul class="space-y-1 px-2">
                    <li><a href="#dashboard" class="sidebar-active flex items-center gap-3 px-3 py-2 rounded-lg"><i class="fas fa-tachometer-alt"></i> <span class="sidebar-text">Dashboard</span></a></li>
                    <li><a href="#material-request" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-box-open"></i> <span class="sidebar-text">Material Request</span></a></li>
                    <li><a href="#order-management" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-file-invoice"></i> <span class="sidebar-text">Order Management</span></a></li>
                    <li><a href="#delivery-tracking" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-truck"></i> <span class="sidebar-text">Delivery Tracking</span></a></li>
                    <li><a href="#complaint-log" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-exclamation-circle"></i> <span class="sidebar-text">Complaint Log</span></a></li>
                    <li><a href="#inventory" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-warehouse"></i> <span class="sidebar-text">Inventory</span></a></li>
                    <li><a href="#settings" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all"><i class="fas fa-cog"></i> <span class="sidebar-text">Settings</span></a></li>
                    <li class="pt-4 mt-4 border-t border-gray-700">
                        <a href="?logout=1" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-danger/20 text-danger-light hover:text-danger transition-all">
                            <i class="fas fa-sign-out-alt"></i> <span class="sidebar-text">Logout</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content (same as before, with dynamic user name) -->
        <main class="flex-1 ml-0 lg:ml-64 p-4 md:p-6">
            <!-- Top Navbar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 id="page-title" class="text-2xl font-bold text-primary">Dashboard</h2>
                    <p class="text-gray-500 text-sm">Welcome back, <?php echo htmlspecialchars($current_user['full_name']); ?> - <?php echo htmlspecialchars($current_user['department']); ?> Department</p>
                </div>
                <div class="flex items-center gap-3 w-full md:w-auto">
                    <div class="relative w-full md:w-64">
                        <input type="text" placeholder="Search system..." class="form-input pl-10 text-sm">
                        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <button class="relative p-2 rounded-full hover:bg-gray-200 transition-all">
                        <i class="fas fa-bell text-primary"></i>
                        <span class="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"></span>
                    </button>
                </div>
            </div>

            <!-- All sections (same as before) go here... -->
            <!-- I'll keep the same content as your original index.html -->
            <div id="dashboard-section" class="mb-8">
                <!-- Your existing dashboard content -->
                <!-- ... -->
            </div>
            <!-- Other sections... -->
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>