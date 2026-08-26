<?php
namespace App\Controllers;

use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;
use App\Database; // <--- CRITICAL: This import was missing!
use PDO;

class ProductController {
    private $repository;
    private $productModel;
    private $categoryRepository;

    public function __construct() {
        $this->repository = new ProductRepository();
        $this->categoryRepository = new CategoryRepository();
    }

    /**
     * Fetch products by category name.
     * This is now case-insensitive and works with PostgreSQL.
     */
    public function getProductsByCategoryName($categoryName) {
        // Handle "All" category
        if (strtolower($categoryName) === 'all') {
            return $this->getProducts();
        }

        // Fixing the Database call here
        $db = (new Database())->getConnection();

        // Use ILIKE for PostgreSQL (case-insensitive)
        $stmt = $db->prepare("
            SELECT p.* 
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            WHERE c.name ILIKE :category_name
        ");
        
        // Add wildcards for ILIKE
        $stmt->execute(['category_name' => '%' . $categoryName . '%']);
        
        // Fetch as associative array
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Fetch products by category ID.
     */
    public function getProductsByCategory($categoryId) {
        return $this->repository->getProductsByCategory($categoryId);
    }

    /**
     * Fetch a single product by ID.
     */
    public function getProductById($id) {
        return $this->repository->getProductById($id);
    }
    
    /**
     * Fetch all products.
     */
    public function getProducts() {
        return $this->repository->getAllProducts();
    }

    public function getProductModel() {
        return $this->productModel;
    }
}