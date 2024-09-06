<?php

namespace App\GraphQL\Mutations;

use App\Models\orders;

final class CreateOrder
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     * @return \App\Models\orders
     */
    public function __invoke($_, array $args): orders
    {
        // Extract input arguments
        $productId = $args['product_id'];
        $productName = $args['product_name'];
        $quantity = $args['quantity'];
        $attributes = $args['attributes']; // This will be a JSON string
        $totalAmount = $args['total_amount'];
        $description=$args['description'];

        // Create a new order
        $order = new orders();
        $order->product_id = $productId;
        $order->product_name = $productName;
        $order->quantity = $quantity;
        $order->description=$description;
        $order->attributes = $attributes; // You may need to decode JSON string if necessary
        $order->total_amount = $totalAmount;
        $order->save();

        return $order;
    }
}
