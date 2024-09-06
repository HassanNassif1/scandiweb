<?php



use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropItemId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products_attributes', function (Blueprint $table) {
            if (Schema::hasColumn('products_attributes', 'item_id')) {
                $table->dropColumn('item_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products_attributes', function (Blueprint $table) {
            if (!Schema::hasColumn('products_attributes', 'item_id')) {
                $table->json('item_id');
            }
        });
    }
}
