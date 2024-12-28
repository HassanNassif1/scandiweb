<?php

// Autoload classes (assuming you are using Composer)
require_once __DIR__ . '/vendor/autoload.php'; 

// Include the migration class
use App\Database\Migrations\CreateCategoriesTable;

// Run the migration
CreateCategoriesTable::down(); // This will execute the up method to apply the migration

// Optionally, you could call down() for rolling back if necessary:
// CreateCategoriesTable::down();
