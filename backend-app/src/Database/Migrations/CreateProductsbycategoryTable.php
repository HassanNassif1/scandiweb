<?php
namespace App\Database\Migrations;
use App\Database;

class CreateProductsbycategoryTable {
    public static function up() {
        $db = (new Database())->getConnection();
        $query = "CREATE TABLE `productsbycategory` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `product_id` (`product_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci";
        try {
            $db->exec($query);
            echo "Productsbycategory table migration completed.\n";
        } catch (\PDOException $e) {
            die("Migration failed: " . $e->getMessage());
        }
    }
}
