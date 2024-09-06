<?php

namespace App\Interfaces;

interface OrderInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllOrders();
}
