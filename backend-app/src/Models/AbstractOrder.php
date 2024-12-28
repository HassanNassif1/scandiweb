<?php

namespace App\Models;

use App\Database;

abstract class AbstractOrder {
    protected $db;

    public function __construct() {
        // Get the database connection
        $this->db = (new Database())->getConnection();
    }

    // General method to execute a query
    protected function executeQuery($query, $params) {
        $stmt = $this->db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindParam($key, $value);
        }
        $stmt->execute();
        return $stmt;
    }

    // Method to get the last inserted ID (for insert operations)
    protected function getLastInsertId() {
        return $this->db->lastInsertId();
    }
}
