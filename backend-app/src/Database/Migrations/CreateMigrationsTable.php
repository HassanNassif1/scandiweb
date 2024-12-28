<?php
namespace App\Database\Migrations;
use App\Database;

class CreateMigrationsTable {
    public static function up() {
        $db = (new Database())->getConnection();
        $query = "CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        try {
            $db->exec($query);
            echo "Migrations table migration completed.\n";
        } catch (\PDOException $e) {
            die("Migration failed: " . $e->getMessage());
        }
    }
}
