<?php

namespace App;

use PDO;
use PDOException;
use Dotenv\Dotenv;

class Database {
    private $pdo;

    public function __construct() {
        // Load .env variables
        $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
        $dotenv->load();

        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $dbname = $_ENV['DB_DATABASE'];
        $username = $_ENV['DB_USERNAME'];
        $password = $_ENV['DB_PASSWORD'];

        try {
            // CHANGE HERE: DSN for PostgreSQL
            $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";
            
            $this->pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}