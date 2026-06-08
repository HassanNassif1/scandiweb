<?php
namespace App\Controllers;

use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;

class ProductController {
    private $repository;
    private $productModel;
    private $categoryRepository;
    public function __construct() {
        // Initialize the ProductRepository to interact with the database
        $this->repository = new ProductRepository();
        $this->categoryRepository = new CategoryRepository();
    }

    /**
     * Fetch products by category.
     *
     * @param int $categoryId The ID of the category to fetch products for.
     * @return array The list of products in the given category.
     */
    public function getProductsByCategory($categoryId) {
        // Fetch products from the repository by category ID
        return $this->repository->getProductsByCategory($categoryId);
    }
    public function getProductsByCategoryName($categoryName) {
        // Fetch the category by name
        $category = $this->categoryRepository->getCategoryByName($categoryName);

        if (!$category) {
            return []; // Return an empty array if no category is found
        }

        // Fetch products based on category ID
        return $this->repository->getProductsByCategory($category['id']);
    }
    public function getProductById($id) {
        return $this->repository->getProductById($id);
    }
    
    /**
     * Fetch all products.
     *
     * @return array The list of all products.
     */
    public function getProducts() {
        // Fetch all products from the repository
        return $this->repository->getAllProducts();
    }
    public function getProductModel() {
        return $this->productModel;
    }
    
}
