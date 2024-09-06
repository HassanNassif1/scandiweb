<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\attributeset;

class AttributeController extends Controller
{
    // Fetch all attributes along with their associated products
    public function getAllAttributes()
    {
        return attributeset::with('attributes', 'products')->get();
    }

    // Fetch all attributes
    public function fetchAttributes()
    {
        // Fetch all attributes along with their associated products
        $attributes = $this->getAllAttributes();

        // Return the fetched attributes as JSON response
        return response()->json($attributes);
    }
}
