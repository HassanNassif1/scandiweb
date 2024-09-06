<?php

namespace App\Repositories;

use App\Interfaces\ProductImageInterface;
use App\Models\productimages;

class ProductImageRepository implements ProductImageInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllImages()
    {
        // Fetch all categories
        return productimages::all();
    }
}
