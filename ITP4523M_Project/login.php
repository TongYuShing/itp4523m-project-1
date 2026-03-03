<?php
// login.php
require_once 'config/auth.php';

$auth = new Auth();

// Redirect if already logged in
if ($auth->isLoggedIn()) {
    header('Location: index.php');
    exit();
}

$error = '';
$success = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $ip_address = $_SERVER['REMOTE_ADDR'];

    if (empty($email) || empty($password)) {
        $error = 'Please enter both email and password';
    } else {
        $result = $auth->login($email, $password, $ip_address);
        if ($result['success']) {
            // Redirect to dashboard
            header('Location: index.php');
            exit();
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
    <title>Premium Living Furniture · Login</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
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
</head>
<body class="bg-gray-50 font-sans min-h-screen flex items-center justify-center p-4"
      style="background-image: radial-gradient(circle at 10% 30%, rgba(139, 90, 43, 0.03) 0%, transparent 30%), 
             radial-gradient(circle at 90% 70%, rgba(45, 55, 72, 0.02) 0%, transparent 40%);">
    
    <div class="w-full max-w-md">
        <!-- Brand -->
        <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 text-2xl font-bold text-primary">
                <i class="fas fa-couch text-secondary"></i>
                <span>Premium Living</span>
            </div>
            <p class="text-gray-500 text-sm mt-1">Central Management System</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="h-2 bg-secondary"></div>
            
            <div class="p-8">
                <h2 class="text-2xl font-bold text-primary mb-1">Welcome back</h2>
                <p class="text-gray-500 text-sm mb-6">Sign in to access the dashboard</p>

                <?php if ($error): ?>
                    <div class="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm flex items-center gap-2">
                        <i class="fas fa-exclamation-circle"></i>
                        <?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm flex items-center gap-2">
                        <i class="fas fa-check-circle"></i>
                        <?php echo htmlspecialchars($success); ?>
                    </div>
                <?php endif; ?>

                <!-- Login Form -->
                <form method="POST" action="" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-envelope mr-1 text-secondary"></i>Email or Employee ID
                        </label>
                        <input type="text" 
                               name="username"
                               value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : 'john.doe@premiumliving.com'; ?>"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition"
                               placeholder="e.g., john.doe@premiumliving.com"
                               required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            <i class="fas fa-lock mr-1 text-secondary"></i>Password
                        </label>
                        <input type="password" 
                               name="password"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition"
                               placeholder="••••••••"
                               required>
                        <div class="flex justify-end mt-1">
                            <button type="button" id="togglePassword" class="text-xs text-gray-400 hover:text-secondary flex items-center gap-1">
                                <i class="far fa-eye"></i> show
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" name="remember" class="rounded border-gray-300 text-secondary focus:ring-secondary/30">
                            <span>Remember this device</span>
                        </label>
                        <a href="forgot-password.php" class="text-secondary hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit" 
                            class="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <i class="fas fa-sign-in-alt"></i> Sign in
                    </button>
                </form>

                <!-- Register link -->
                <div class="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? 
                    <a href="register.php" class="text-secondary hover:underline font-medium">Register here</a>
                </div>

                <!-- Demo credentials hint -->
                <div class="mt-6 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
                    <p class="mb-1">Demo credentials (use these to login):</p>
                    <p class="flex items-center justify-center gap-4">
                        <span><i class="far fa-user text-secondary"></i> john.doe@premiumliving.com</span>
                        <span><i class="fas fa-key text-secondary"></i> demo123</span>
                    </p>
                    <p class="mt-1">Or <a href="register.php" class="text-secondary hover:underline">register a new account</a></p>
                </div>
            </div>
        </div>

        <p class="text-center text-xs text-gray-400 mt-6">
            © 2026 Premium Living Furniture. Authorised personnel only.
        </p>
    </div>

    <script>
        // Toggle password visibility
        document.getElementById('togglePassword')?.addEventListener('click', function(e) {
            e.preventDefault();
            const passwordInput = document.querySelector('input[name="password"]');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
            this.innerHTML = type === 'password' ? '<i class="far fa-eye"></i> show' : '<i class="far fa-eye-slash"></i> hide';
        });
    </script>
</body>
</html>