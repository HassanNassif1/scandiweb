<?php
namespace App\Models;

abstract class AbstractCurrency {
    // Declare the properties
    protected $id;
    protected $label;
    protected $symbol;
    protected $createdAt;
    protected $updatedAt;

    // Abstract methods to be implemented by subclasses
    abstract public function getId();
    abstract public function setId($id);

    abstract public function getLabel();
    abstract public function setLabel($label);

    abstract public function getSymbol();
    abstract public function setSymbol($symbol);

    abstract public function getCreatedAt();
    abstract public function setCreatedAt($createdAt);

    abstract public function getUpdatedAt();
    abstract public function setUpdatedAt($updatedAt);
}
