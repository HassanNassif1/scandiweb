<?php

require_once __DIR__ . '/../vendor/autoload.php'; // Adjust the path if needed
use App\Database;

class MigrationGenerator {
    public static function generateMigrations() {
        $db = (new Database())->getConnection(); // Assuming you have a Database class with this method
        $stmt = $db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($tables as $table) {
            $stmt = $db->query("SHOW CREATE TABLE $table");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $createTableSQL = $result['Create Table'];

            $migrationFile = __DIR__ . "/../src/Database/Migrations/Create" . ucfirst($table) . "Table.php";
            file_put_contents($migrationFile, self::buildMigrationClass($table, $createTableSQL));

            echo "Migration file for $table created at $migrationFile\n";
        }
    }

    private static function buildMigrationClass($tableName, $createTableSQL) {
        return "<?php
namespace App\\Database\\Migrations;
use App\\Database;

class Create" . ucfirst($tableName) . "Table {
    public static function up() {
        \$db = (new Database())->getConnection();
        \$query = \"" . addslashes($createTableSQL) . "\";
        try {
            \$db->exec(\$query);
            echo \"" . ucfirst($tableName) . " table migration completed.\\n\";
        } catch (\\PDOException \$e) {
            die(\"Migration failed: \" . \$e->getMessage());
        }
    }
}
";
    }
}

// Run the migration generator
MigrationGenerator::generateMigrations();
