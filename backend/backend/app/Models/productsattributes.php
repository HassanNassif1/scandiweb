<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class productsattributes extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'product_id', 'attribute_id', 'item_displayValue', 'item_id'];

    public function product()
    {
        return $this->belongsTo(products::class);
    }

    public function attribute()
    {
        return $this->belongsTo(attributes::class);
    }
}
