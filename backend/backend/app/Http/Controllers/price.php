<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\products;
class price extends Controller
{
    //
    public function product()
    {
        return $this->belongsTo(products::class);
    }
}
