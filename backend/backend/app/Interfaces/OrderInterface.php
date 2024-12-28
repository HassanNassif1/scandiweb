<?php

namespace App\Interfaces;

interface OrderInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function createOrder($product_id, $product_name, $description, $total_amount, $attributes, $quantity);
}
