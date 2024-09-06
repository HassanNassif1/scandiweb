<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class prices extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'product_id', 'amount', 'currency_id'];

    public function pricable()
    {
        return $this->morphTo();
    }
}
