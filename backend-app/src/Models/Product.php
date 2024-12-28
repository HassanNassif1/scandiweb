<?php
namespace App\Models;

class Product extends AbstractProduct {
    public function __construct($id = null, $name = '', $description = '', $categoryId = null, $brand = '', $price = 0.0, $attributes = '', $inStock = 0, $image = '', $createdAt = null, $updatedAt = null) {
        parent::__construct($id); // Initialize parent properties
        $this->name = $name;
        $this->description = $description;
        $this->categoryId = $categoryId;
        $this->brand = $brand;
        $this->price = $price;
        $this->attributes = $attributes;
        $this->inStock = $inStock;
        $this->image = $image;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // Implement Getter and Setter for Name
    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    // Implement Getter and Setter for Description
    public function getDescription() {
        return $this->description;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    // Implement Getter and Setter for Category ID
    public function getCategoryId() {
        return $this->categoryId;
    }

    public function setCategoryId($categoryId) {
        $this->categoryId = $categoryId;
    }

    // Implement Getter and Setter for Brand
    public function getBrand() {
        return $this->brand;
    }

    public function setBrand($brand) {
        $this->brand = $brand;
    }

    // Implement Getter and Setter for Price
    public function getPrice() {
        return $this->price;
    }

    public function setPrice($price) {
        $this->price = $price;
    }

    // Implement Getter and Setter for Attributes
    public function getAttributes() {
        return $this->attributes;
    }

    public function setAttributes($attributes) {
        $this->attributes = $attributes;
    }

    // Implement Getter and Setter for In Stock
    public function getInStock() {
        return $this->inStock;
    }

    public function setInStock($inStock) {
        $this->inStock = $inStock;
    }

    // Implement Getter and Setter for Image
    public function getImage() {
        return $this->image;
    }

    public function setImage($image) {
        $this->image = $image;
    }

    // Implement Getter and Setter for Created At
    public function getCreatedAt() {
        return $this->createdAt;
    }

    public function setCreatedAt($createdAt) {
        $this->createdAt = $createdAt;
    }

    // Implement Getter and Setter for Updated At
    public function getUpdatedAt() {
        return $this->updatedAt;
    }

    public function setUpdatedAt($updatedAt) {
        $this->updatedAt = $updatedAt;
    }
}
