<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\CategoryInterface;

class CategoriesController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    // Fetch all categories
    public function fetchCategories()
    {
        // Fetch all categories using the injected repository
        $categories = $this->categoryRepository->getAllCategories();

        // Return the fetched categories as JSON response
        return response()->json($categories);
    }
}
