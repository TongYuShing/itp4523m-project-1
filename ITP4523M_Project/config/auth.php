<?php
// config/auth.php
require_once 'database.php';

class Auth {
    private $conn;
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // Register new user
    public function register($employee_id, $full_name, $email, $password, $department, $role) {
        try {
            // Check if user already exists
            $query = "SELECT id FROM users WHERE email = :email OR employee_id = :employee_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':employee_id', $employee_id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'User with this email or employee ID already exists'];
            }

            // Hash password
            $password_hash = password_hash($password, PASSWORD_BCRYPT);

            // Insert new user
            $query = "INSERT INTO users (employee_id, full_name, email, password_hash, department, role) 
                      VALUES (:employee_id, :full_name, :email, :password_hash, :department, :role)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':employee_id', $employee_id);
            $stmt->bindParam(':full_name', $full_name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password_hash', $password_hash);
            $stmt->bindParam(':department', $department);
            $stmt->bindParam(':role', $role);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Registration successful', 'user_id' => $this->conn->lastInsertId()];
            }
            
            return ['success' => false, 'message' => 'Registration failed'];
        } catch(PDOException $e) {
            error_log("Registration error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Database error occurred'];
        }
    }

    // Login user
    public function login($email, $password, $ip_address) {
        try {
            // Check login attempts (prevent brute force)
            if ($this->isIpBlocked($ip_address)) {
                $this->logAttempt($email, $ip_address, false);
                return ['success' => false, 'message' => 'Too many failed attempts. Please try again later.'];
            }

            // Get user by email
            $query = "SELECT id, employee_id, full_name, email, password_hash, department, role, is_active 
                      FROM users WHERE email = :email AND is_active = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() === 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (password_verify($password, $user['password_hash'])) {
                    // Login successful
                    $this->logAttempt($email, $ip_address, true);
                    
                    // Update last login
                    $update = "UPDATE users SET last_login = NOW() WHERE id = :id";
                    $stmt = $this->conn->prepare($update);
                    $stmt->bindParam(':id', $user['id']);
                    $stmt->execute();

                    // Create session
                    $session_token = $this->createSession($user['id'], $ip_address);
                    
                    // Set session variables
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['employee_id'] = $user['employee_id'];
                    $_SESSION['full_name'] = $user['full_name'];
                    $_SESSION['email'] = $user['email'];
                    $_SESSION['department'] = $user['department'];
                    $_SESSION['role'] = $user['role'];
                    $_SESSION['session_token'] = $session_token;
                    $_SESSION['login_time'] = time();

                    return [
                        'success' => true,
                        'message' => 'Login successful',
                        'user' => [
                            'full_name' => $user['full_name'],
                            'department' => $user['department'],
                            'role' => $user['role']
                        ]
                    ];
                }
            }

            // Login failed
            $this->logAttempt($email, $ip_address, false);
            return ['success' => false, 'message' => 'Invalid email or password'];

        } catch(PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Database error occurred'];
        }
    }

    // Check if IP is blocked (more than 5 failed attempts in 15 minutes)
    private function isIpBlocked($ip_address) {
        $query = "SELECT COUNT(*) as attempts FROM login_attempts 
                  WHERE ip_address = :ip_address 
                  AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
                  AND success = 0";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result['attempts'] >= 5;
    }

    // Log login attempt
    private function logAttempt($email, $ip_address, $success) {
        $query = "INSERT INTO login_attempts (email, ip_address, attempt_time, success) 
                  VALUES (:email, :ip_address, NOW(), :success)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->bindParam(':success', $success, PDO::PARAM_BOOL);
        $stmt->execute();
    }

    // Create user session
    private function createSession($user_id, $ip_address) {
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+24 hours'));
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $query = "INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) 
                  VALUES (:user_id, :session_token, :ip_address, :user_agent, :expires_at)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':session_token', $session_token);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->bindParam(':user_agent', $user_agent);
        $stmt->bindParam(':expires_at', $expires_at);
        $stmt->execute();

        return $session_token;
    }

    // Check if user is logged in
    public function isLoggedIn() {
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
            return false;
        }

        // Verify session in database
        $query = "SELECT id FROM user_sessions 
                  WHERE user_id = :user_id 
                  AND session_token = :session_token 
                  AND expires_at > NOW()";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $_SESSION['user_id']);
        $stmt->bindParam(':session_token', $_SESSION['session_token']);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    // Logout user
    public function logout() {
        if (isset($_SESSION['user_id']) && isset($_SESSION['session_token'])) {
            // Delete session from database
            $query = "DELETE FROM user_sessions WHERE user_id = :user_id AND session_token = :session_token";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $_SESSION['user_id']);
            $stmt->bindParam(':session_token', $_SESSION['session_token']);
            $stmt->execute();
        }

        // Clear session
        $_SESSION = array();
        session_destroy();
        
        return ['success' => true, 'message' => 'Logged out successfully'];
    }

    // Get current user info
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'employee_id' => $_SESSION['employee_id'],
            'full_name' => $_SESSION['full_name'],
            'email' => $_SESSION['email'],
            'department' => $_SESSION['department'],
            'role' => $_SESSION['role']
        ];
    }

    // Change password
    public function changePassword($user_id, $old_password, $new_password) {
        try {
            // Verify old password
            $query = "SELECT password_hash FROM users WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $user_id);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!password_verify($old_password, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Current password is incorrect'];
            }

            // Update password
            $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
            $update = "UPDATE users SET password_hash = :password_hash WHERE id = :id";
            $stmt = $this->conn->prepare($update);
            $stmt->bindParam(':password_hash', $new_password_hash);
            $stmt->bindParam(':id', $user_id);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Password changed successfully'];
            }
            
            return ['success' => false, 'message' => 'Failed to change password'];
        } catch(PDOException $e) {
            error_log("Password change error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Database error occurred'];
        }
    }
}
?>