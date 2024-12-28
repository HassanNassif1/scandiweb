<?php

namespace App\Repositories;

use App\Interfaces\CurrencyInterface; 
use App\Database;

class CurrencyRepository implements CurrencyInterface {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllCurrencies() {
        // Ensure the correct SQL query is executed
        $stmt = $this->db->query("SELECT * FROM currencies");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC); // Returns an array of currencies
    }

    public function getCurrencyById($id) {
        $stmt = $this->db->prepare("SELECT * FROM currencies WHERE id = :id");
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);  // Return a single currency object
    }
}
