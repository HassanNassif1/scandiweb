<?php

namespace App\Interfaces;

interface ProductImageInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllImages();
}
