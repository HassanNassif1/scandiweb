<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Rename the existing 'category' column to 'category_id'
           
            // Change the data type of the 'category_id' column to unsigned big integer
            $table->unsignedBigInteger('category_id')->change();
            // Add foreign key constraint
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['category_id']);
            // Remove the foreign key column
            $table->dropColumn('category_id');
            // Rename the 'category_id' column back to 'category'
       
        });
    }
}
