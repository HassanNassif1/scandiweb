<?php


namespace App\Interfaces;

interface ProductInterface
{
   
    public function getAllProducts();

  
    public function getProductById($productId);

    public function getProductsByCategory($categoryId);
   
}
