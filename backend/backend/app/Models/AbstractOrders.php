<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbstractOrders extends Model
{
    use HasFactory;

    protected $fillable = ['id','product_name','attributes','product_id', 'quantity','total_amount'];

    public function product()
    {
        return $this->belongsTo(products::class);
    }

    // Add more relationships as needed, such as customer relationship
}
