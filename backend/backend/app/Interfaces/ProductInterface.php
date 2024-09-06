<?php

namespace App\Interfaces;

interface ProductInterface
{
    /**
     * Fetch all products.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllProducts();
  
   
}
