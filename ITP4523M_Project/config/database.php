<?php
// config/database.php
class Database {
    private $host = 'localhost';
    private $db_name = 'premium_living_db';
    private $username = 'root'; // Change this to your MySQL username
    private $password = ''; // Change this to your MySQL password
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $e) {
            error_log("Connection error: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }

    // Create tables if they don't exist
    public function initializeDatabase() {
        $conn = $this->getConnection();
        if (!$conn) return false;

        try {
            // Read and execute the SQL schema
            $sql = file_get_contents(__DIR__ . '/../database.sql');
            $conn->exec($sql);
            return true;
        } catch(PDOException $e) {
            error_log("Database initialization error: " . $e->getMessage());
            return false;
        }
    }
}
?>