<?php
namespace App\Interfaces;

interface CategoryInterface {
    public function getCategories();  // Method in the interface
    public function getCategoryById($id);
    public function getAllCategories();  // The missing method
}
