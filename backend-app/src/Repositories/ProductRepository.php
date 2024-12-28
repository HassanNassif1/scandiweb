<?php
namespace App\Repositories;

use App\Models\Product;
use App\Database;
use PDO;
use App\Interfaces\ProductInterface;
class ProductRepository implements ProductInterface {
    
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllProducts() {
        $query = "SELECT id, name, description, in_stock, brand, price, attributes, image, category_id FROM products";
        $statement = $this->db->prepare($query);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

 
    // New method to fetch products by category
    public function getProductsByCategory($categoryId) {
        $query = "SELECT id, name, description, in_stock, brand, price, attributes, image, category_id 
                  FROM products 
                  WHERE category_id = :category_id";
        $statement = $this->db->prepare($query);
        $statement->bindParam(':category_id', $categoryId, PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getProductById($productId) {
        $query = "SELECT id, name, description, in_stock, brand, price, attributes, image, category_id 
                  FROM products 
                  WHERE id = :id";
        $statement = $this->db->prepare($query);
        $statement->bindParam(':id', $productId, PDO::PARAM_INT);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    
}
