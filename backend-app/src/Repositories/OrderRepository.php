<?php

namespace App\Repositories;

use App\Interfaces\OrderInterface;
use App\Database;

class OrderRepository implements OrderInterface
{
    private $db;

    public function __construct() {
        // Get the database connection
        $this->db = (new Database())->getConnection();
    }

    public function createOrder($product_id, $product_name, $description, $total_amount, $attributes, $quantity) {
        // SQL query to insert a new order
        $stmt = $this->db->prepare(
            "INSERT INTO orders (product_id, product_name, description, total_amount, attributes, quantity) 
            VALUES (:product_id, :product_name, :description, :total_amount, :attributes, :quantity)"
        );

        // Bind the parameters to the SQL query
        $stmt->bindParam(':product_id', $product_id);
        $stmt->bindParam(':product_name', $product_name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':total_amount', $total_amount);
        $stmt->bindParam(':attributes', $attributes);
        $stmt->bindParam(':quantity', $quantity);

        // Execute the query
        if ($stmt->execute()) {
            // Return the newly created order
            return [
                'id' => $this->db->lastInsertId(),
                'product_id' => $product_id,
                'product_name' => $product_name,
                'description' => $description,
                'total_amount' => $total_amount,
                'attributes' => $attributes,
                'quantity' => $quantity,
            ];
        }

        return null; // Return null if the order creation fails
    }


}
