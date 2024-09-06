<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\products;
use App\Models\attributes;
class attributeset extends Controller
{
    //
    public function attribute()
    {
        return $this->belongsTo(attributes::class);
    }

    public function product()
    {
        return $this->belongsTo(products::class);
    }
}
