<?php

namespace App\Models;

class Currency extends AbstractCurrency {
    // Define properties for the fields in the currencies table
    public $id;
    public $label;
    public $symbol;
    public $created_at;
    public $updated_at;

    // Constructor to initialize the fields
    public function __construct($id = null, $label = null, $symbol = null, $created_at = null, $updated_at = null) {
        $this->id = $id;
        $this->label = $label;
        $this->symbol = $symbol;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    // Implement abstract methods

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getLabel() {
        return $this->label;
    }

    public function setLabel($label) {
        $this->label = $label;
    }

    public function getSymbol() {
        return $this->symbol;
    }

    public function setSymbol($symbol) {
        $this->symbol = $symbol;
    }

    public function getCreatedAt() {
        return $this->created_at;
    }

    public function setCreatedAt($createdAt) {
        $this->created_at = $createdAt;
    }

    public function getUpdatedAt() {
        return $this->updated_at;
    }

    public function setUpdatedAt($updatedAt) {
        $this->updated_at = $updatedAt;
    }
}
