<?php
// forgot-password.php
require_once 'config/auth.php';

$auth = new Auth();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    
    if (empty($email)) {
        $error = 'Please enter your email address';
    } else {
        // Generate reset token (in production, send email)
        // For demo, just show success message
        $success = 'If the email exists in our system, you will receive password reset instructions.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Living · Reset Password</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-gray-50 font-sans min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 text-2xl font-bold text-primary">
                <i class="fas fa-couch text-secondary"></i>
                <span>Premium Living</span>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div class="h-2 bg-secondary"></div>
            <div class="p-8">
                <h2 class="text-2xl font-bold text-primary mb-2">Reset Password</h2>
                <p class="text-gray-500 text-sm mb-6">Enter your email to receive reset instructions</p>

                <?php if ($error): ?>
                    <div class="mb-4 p-3 bg-danger/10 text-danger text-sm rounded-lg">
                        <i class="fas fa-exclamation-circle mr-2"></i><?php echo htmlspecialchars($error); ?>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="mb-4 p-3 bg-success/10 text-success text-sm rounded-lg">
                        <i class="fas fa-check-circle mr-2"></i><?php echo htmlspecialchars($success); ?>
                    </div>
                <?php endif; ?>

                <form method="POST" action="">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/40">
                    </div>
                    <button type="submit" 
                            class="w-full bg-secondary hover:bg-secondary/90 text-white font-medium py-2 rounded-lg transition">
                        Send Reset Link
                    </button>
                </form>

                <div class="mt-4 text-center">
                    <a href="login.php" class="text-sm text-secondary hover:underline">
                        <i class="fas fa-arrow-left mr-1"></i>Back to Login
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>