<?php
// register.php
require_once 'config/auth.php';

$auth = new Auth();
$error = '';
$success = '';

// Handle registration form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $employee_id = $_POST['employee_id'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $department = $_POST['department'] ?? '';
    $role = $_POST['role'] ?? 'Clerk'; // Default role

    // Validation
    if (empty($employee_id) || empty($full_name) || empty($email) || empty($password) || empty($department)) {
        $error = 'Please fill in all required fields';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address';
    } else {
        // Attempt registration
        $result = $auth->register($employee_id, $full_name, $email, $password, $department, $role);
        
        if ($result['success']) {
            $success = 'Registration successful! You can now login.';
            // Clear form
            $_POST = array();
        } else {
            $error = $result['message'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Living · Register</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#2D3748',
                        secondary: '#8B5A2B',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 font-sans min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
        <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 text-2xl font-bold text-primary">
                <i class="fas fa-couch text-secondary"></i>
                <span>Premium Living</span>
            </div>
            <p class="text-gray-500 text-sm">Create new account</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="h-2 bg-secondary"></div>
            <div class="p-8">
                <h2 class="text-2xl font-bold text-primary mb-6">Register</h2>

                <?php if ($error): ?>
                    <div class="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                        <i class="fas fa-exclamation-circle mr-2"></i><?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                        <i class="fas fa-check-circle mr-2"></i><?php echo htmlspecialchars($success); ?>
                        <a href="login.php" class="block mt-2 text-secondary hover:underline">Click here to login →</a>
                    </div>
                <?php endif; ?>

                <form method="POST" action="" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                        <input type="text" name="employee_id" value="<?php echo htmlspecialchars($_POST['employee_id'] ?? ''); ?>" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input type="text" name="full_name" value="<?php echo htmlspecialchars($_POST['full_name'] ?? ''); ?>" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                        <select name="department" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                            <option value="">Select Department</option>
                            <option value="Production" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Production') ? 'selected' : ''; ?>>Production</option>
                            <option value="Inventory" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Inventory') ? 'selected' : ''; ?>>Inventory</option>
                            <option value="Logistics" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Logistics') ? 'selected' : ''; ?>>Logistics</option>
                            <option value="Design" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Design') ? 'selected' : ''; ?>>Design</option>
                            <option value="Sales" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Sales') ? 'selected' : ''; ?>>Sales</option>
                            <option value="Management" <?php echo (isset($_POST['department']) && $_POST['department'] == 'Management') ? 'selected' : ''; ?>>Management</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input type="text" name="role" value="<?php echo htmlspecialchars($_POST['role'] ?? 'Clerk'); ?>" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input type="password" name="password" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input type="password" name="confirm_password" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40" required>
                    </div>

                    <div class="md:col-span-2 flex gap-3 justify-end mt-4">
                        <a href="login.php" class="btn-secondary px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                            Cancel
                        </a>
                        <button type="submit" class="btn-primary px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition">
                            Register
                        </button>
                    </div>
                </form>

                <div class="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <a href="login.php" class="text-secondary hover:underline">Login here</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>