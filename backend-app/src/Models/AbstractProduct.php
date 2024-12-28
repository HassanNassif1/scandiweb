<?php
namespace App\Models;

abstract class AbstractProduct {
    // Declare the common properties for the Product class
    protected $id;
    protected $name;
    protected $description;
    protected $categoryId;
    protected $brand;
    protected $price;
    protected $attributes;
    protected $inStock;
    protected $image;
    protected $createdAt;
    protected $updatedAt;

    // Abstract methods that must be implemented by subclasses
    abstract public function getName();
    abstract public function setName($name);

    abstract public function getDescription();
    abstract public function setDescription($description);

    abstract public function getCategoryId();
    abstract public function setCategoryId($categoryId);

    abstract public function getBrand();
    abstract public function setBrand($brand);

    abstract public function getPrice();
    abstract public function setPrice($price);

    abstract public function getAttributes();
    abstract public function setAttributes($attributes);

    abstract public function getInStock();
    abstract public function setInStock($inStock);

    abstract public function getImage();
    abstract public function setImage($image);

    // Abstract methods for createdAt and updatedAt if needed
    abstract public function getCreatedAt();
    abstract public function setCreatedAt($createdAt);

    abstract public function getUpdatedAt();
    abstract public function setUpdatedAt($updatedAt);
}
