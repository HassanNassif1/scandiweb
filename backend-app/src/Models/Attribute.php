<?php
namespace App\Models;

class Attribute extends AbstractAttribute {
    // Define properties for the fields in the attributes table
    public $id;
    public $name;
    public $type;

    // Constructor to initialize the fields
    public function __construct($id = null, $name = null, $type = null) {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
    }

    // Implement abstract methods

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function getType() {
        return $this->type;
    }

    public function setType($type) {
        $this->type = $type;
    }
}
