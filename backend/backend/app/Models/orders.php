<?php

namespace App\Models;

class orders extends AbstractOrders
{
    /**
     * Get details of the product.
     *
     * @return string
     */
    public function getOrdersDetails()
    {
        return "ID: {$this->id}, Name: {$this->name}";
    }

   
}
