<?php

namespace App\Repositories;

use App\Interfaces\ProductInterface;
use App\Models\products; // Ensure correct capitalization

class ProductRepository implements ProductInterface
{
    /**
     * Fetch all products.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProducts()
    {
        // Retrieve all products using Eloquent ORM
        return products::all();
    }

    /**
     * Get product by ID.
     *
     * @param int $productId
     * @return \App\Models\products|null
     */
    public function getProductById($productId)
    {
        // Find the product by its ID using Eloquent ORM
        return products::find($productId);
    }
}
