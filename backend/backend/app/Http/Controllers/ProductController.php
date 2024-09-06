<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\ProductInterface;

class ProductController extends Controller
{
    protected $productRepository;

    public function __construct(ProductInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    // Fetch all products along with their category and images
    public function fetchProducts()
    {
        // Fetch all products using the injected repository
        $products = $this->productRepository->getAllProducts();

        // Return the fetched products as JSON response
        return response()->json($products);
    }

    // Get products by category
    public function fetchProductsByID($id){
        $products = $this->productRepository->getProductById($id);
    
        // Return the fetched products as JSON response
        return response()->json($products);
    }
    }

