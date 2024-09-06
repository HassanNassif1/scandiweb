<?php

namespace App\Repositories;

use App\Interfaces\CategoryInterface;
use App\Models\Categories;

class CategoryRepository implements CategoryInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories()
    {
        // Fetch all categories
        return Categories::all();
    }
}
