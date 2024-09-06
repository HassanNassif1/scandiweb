<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ImportDataFromJson extends Command
{
    protected $signature = 'import:json';

    protected $description = 'Import data from JSON file to MySQL database';

    public function handle()
    {
        $json = file_get_contents('C:\Users\DELL\Desktop\data\data.json');
        $data = json_decode($json, true);

        // Define the table name
        $tableName = 'products';

        // Get the columns of the table
        $columns = Schema::getColumnListing($tableName);

        foreach ($data as $item) {
            // Filter the item to include only existing columns
            $filteredItem = array_intersect_key($item, array_flip($columns));
            
            // Insert the filtered item into the database
            DB::table($tableName)->insert($filteredItem);
        }

        $this->info('Data imported successfully.');
    }
}
