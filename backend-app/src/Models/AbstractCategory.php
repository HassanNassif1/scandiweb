<?php
namespace App\Models;

abstract class AbstractCategory {
    // Declare the properties
    protected $id;
    protected $name;
    protected $description;
    protected $createdAt;
    protected $updatedAt;

    // Abstract methods to be implemented by subclasses
    abstract public function getId();
    abstract public function setId($id);

    abstract public function getName();
    abstract public function setName($name);

    abstract public function getDescription();
    abstract public function setDescription($description);

    abstract public function getCreatedAt();
    abstract public function setCreatedAt($createdAt);

    abstract public function getUpdatedAt();
    abstract public function setUpdatedAt($updatedAt);
}
