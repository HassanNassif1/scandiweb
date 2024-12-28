<?php

namespace App\Controllers;

use App\Repositories\OrderRepository;

class OrderController {
    private $repository;

    public function __construct() {
        // Initialize the OrderRepository to interact with the database
        $this->repository = new OrderRepository();
    }

    /**
     * Create a new order.
     *
     * @param int $product_id The ID of the product being ordered.
     * @param string $product_name The name of the product.
     * @param string $description A description of the product.
     * @param float $total_amount The total amount of the order.
     * @param string $attributes A JSON string of product attributes.
     * @param int $quantity The quantity of the product being ordered.
     * @return array|null The newly created order or null if creation fails.
     */
    public function createOrder($product_id, $product_name, $description, $total_amount, $attributes, $quantity) {
        // Call the repository to create the order
        return $this->repository->createOrder(
            $product_id,
            $product_name,
            $description,
            $total_amount,
            $attributes,
            $quantity
        );
    }
}
