<?php
namespace App\Repositories;

use App\Models\Category;
use App\Interfaces\CategoryInterface;
use App\Database;
class CategoryRepository implements CategoryInterface {

    // Existing method
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }
    public function getCategories() {
        $stmt = $this->db->query("SELECT * FROM categories");
        $products = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        return $products;
    }
    public function getCategoryByName($categoryName) {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE name = :name");
        $stmt->bindParam(':name', $categoryName, \PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
    // Existing method
    public function getCategoryById($productId) {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = :id");
        $stmt->bindParam(':id', $productId, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    // New method to satisfy the interface
    public function getAllCategories() {
        return $this->getCategories();  // You can delegate to getCategories or implement separately if needed
    }
}
