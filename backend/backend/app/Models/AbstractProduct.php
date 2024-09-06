<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbstractProduct extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name', 'in_stock', 'description', 'category_id', 'price', 'brand'];

    public function attributes()
    {
        return $this->morphMany(attributes::class, 'attributable');
    }

    public function prices()
    {
        return $this->morphMany(prices::class, 'pricable');
    }

    public function images()
    {
        return $this->morphMany(productimages::class, 'imageable');
    }

    public function category()
    {
        return $this->belongsTo(categories::class);
    }
}
