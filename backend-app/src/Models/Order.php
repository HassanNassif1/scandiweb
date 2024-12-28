<?php

namespace App\Models;

class Order extends AbstractOrder {
    private $id;
    private $product_id;
    private $product_name;
    private $description;
    private $total_amount;
    private $attributes;
    private $quantity;

    // Constructor to initialize the order
    public function __construct($id = null, $product_id = null, $product_name = "", $description = "", $total_amount = 0.0, $attributes = "", $quantity = 0) {
        $this->id = $id;
        $this->product_id = $product_id;
        $this->product_name = $product_name;
        $this->description = $description;
        $this->total_amount = $total_amount;
        $this->attributes = $attributes;
        $this->quantity = $quantity;
    }

    // Getter and Setter for ID
    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    // Getter and Setter for Product ID
    public function getProductId() {
        return $this->product_id;
    }

    public function setProductId($product_id) {
        $this->product_id = $product_id;
    }

    // Getter and Setter for Product Name
    public function getProductName() {
        return $this->product_name;
    }

    public function setProductName($product_name) {
        $this->product_name = $product_name;
    }

    // Getter and Setter for Description
    public function getDescription() {
        return $this->description;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    // Getter and Setter for Total Amount
    public function getTotalAmount() {
        return $this->total_amount;
    }

    public function setTotalAmount($total_amount) {
        $this->total_amount = $total_amount;
    }

    // Getter and Setter for Attributes
    public function getAttributes() {
        return $this->attributes;
    }

    public function setAttributes($attributes) {
        $this->attributes = $attributes;
    }

    // Getter and Setter for Quantity
    public function getQuantity() {
        return $this->quantity;
    }

    public function setQuantity($quantity) {
        $this->quantity = $quantity;
    }

    // Method to create an order
   
}
