<?php

namespace App\Repositories;

use App\Interfaces\OrderInterface;
use App\Models\orders;

class OrderRepository implements OrderInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllOrders()
    {
        // Fetch all categories
        return orders::all();
    }
   
}
