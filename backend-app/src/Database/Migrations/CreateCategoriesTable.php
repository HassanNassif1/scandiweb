<?php
namespace App\Database\Migrations;

use App\Database;

class CreateCategoriesTable {
    /**
     * Run the migration to create the categories table (without 'description' column).
     */
    public static function up() {
        $db = (new Database())->getConnection();

        // Original CREATE TABLE query (without 'description' column)
        $query = "CREATE TABLE IF NOT EXISTS `categories` (
            `id` bigint unsigned NOT NULL AUTO_INCREMENT,
            `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

        try {
            $db->exec($query);
            echo "Categories table created without 'description' column.\n";
        } catch (\PDOException $e) {
            die("Migration failed: " . $e->getMessage());
        }
    }

    /**
     * Rollback the migration by removing the description column (if added).
     */
    public static function down() {
        $db = (new Database())->getConnection();

        // Check if the 'description' column exists
        $checkColumnQuery = "SHOW COLUMNS FROM `categories` LIKE 'description'";
        $stmt = $db->query($checkColumnQuery);
        $columnExists = $stmt->fetch(\PDO::FETCH_ASSOC);

        // If column exists, remove it
        if ($columnExists) {
            $query = "ALTER TABLE `categories` DROP COLUMN `description`";
            try {
                $db->exec($query);
                echo "'description' column removed successfully.\n";
            } catch (\PDOException $e) {
                die("Rollback failed: " . $e->getMessage());
            }
        } else {
            echo "'description' column does not exist, nothing to remove.\n";
        }
    }
}
