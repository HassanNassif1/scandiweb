<?php

namespace App\Interfaces;

interface CategoryInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCategories();
}
