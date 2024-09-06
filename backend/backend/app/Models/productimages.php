<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class productimages extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'product_id', 'image_url'];

    public function imageable()
    {
        return $this->morphTo();
    }
}
