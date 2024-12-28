<?php
namespace App\Database\Migrations;
use App\Database;

class CreateCurrenciesTable {
    public static function up() {
        $db = (new Database())->getConnection();
        $query = "CREATE TABLE `currencies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        try {
            $db->exec($query);
            echo "Currencies table migration completed.\n";
        } catch (\PDOException $e) {
            die("Migration failed: " . $e->getMessage());
        }
    }
}
