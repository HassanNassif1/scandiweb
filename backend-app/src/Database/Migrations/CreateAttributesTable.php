<?php
namespace App\Database\Migrations;
use App\Database;

class CreateAttributesTable {
    public static function up() {
        $db = (new Database())->getConnection();
        $query = "CREATE TABLE `attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        try {
            $db->exec($query);
            echo "Attributes table migration completed.\n";
        } catch (\PDOException $e) {
            die("Migration failed: " . $e->getMessage());
        }
    }
}
