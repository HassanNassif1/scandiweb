<?php

namespace App\Models;

class attributes extends AbstractAttributes
{
    /**
     * Get details of the product.
     *
     * @return string
     */
    public function getAttributeDetails()
    {
        return "ID: {$this->id}, Name: {$this->name}, Type: {$this->type}";
    }

   
}
