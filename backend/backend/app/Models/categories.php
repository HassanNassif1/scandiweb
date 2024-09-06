<?php

namespace App\Models;

class categories extends AbstractCategories
{
    /**
     * Get details of the product.
     *
     * @return string
     */
    public function getCategoriesDetails()
    {
        return "ID: {$this->id}, Name: {$this->name}";
    }

   
}
