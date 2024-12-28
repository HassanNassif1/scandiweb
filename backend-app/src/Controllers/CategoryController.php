<?php

namespace App\Controllers;

use App\Repositories\CategoryRepository;

class CategoryController {
    private $repository;

    public function __construct() {
        // Initialize the CategoryRepository to interact with the database
        $this->repository = new CategoryRepository();
    }

    /**
     * Fetch all categories.
     *
     * @return array List of all categories.
     */
    public function getCategories() {
        // Fetch all categories using the repository
        $categories = $this->repository->getAllCategories();
        
        // Log a message if no categories are found
        if (empty($categories)) {
            error_log("No categories found");
        }

        return $categories;
    }

    /**
     * Fetch a category by its ID.
     *
     * @param int $id The ID of the category to fetch.
     * @return array|null The category data or null if not found.
     */
    public function getCategoryById($id) {
        // Fetch the category by ID using the repository
        $category = $this->repository->getCategoryById($id);
        
        // Log a message if the category is not found
        if (!$category) {
            error_log("Category not found with ID: " . $id);
        }

        return $category;
    }
}
