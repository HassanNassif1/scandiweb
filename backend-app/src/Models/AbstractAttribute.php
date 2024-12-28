<?php
namespace App\Models;

abstract class AbstractAttribute {
    // Declare the properties
    protected $id;
    protected $name;
    protected $type;

    // Abstract methods to be implemented by subclasses
    abstract public function getId();
    abstract public function setId($id);

    abstract public function getName();
    abstract public function setName($name);

    abstract public function getType();
    abstract public function setType($type);
}
