<?php

namespace App\Models;

class products extends AbstractProduct
{
    /**
     * Get details of the product.
     *
     * @return string
     */
    public function getProductDetails()
    {
        return "ID: {$this->id}, Name: {$this->name}, In Stock: {$this->in_stock}, Description: {$this->description}, Category ID: {$this->category_id}, Price: {$this->price}, Brand: {$this->brand}";
    }

   
}
