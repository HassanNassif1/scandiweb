<?php

namespace App\GraphQL\Resolvers;

use App\Models\products;

class ProductResolver
{
    public function product($root, $args)
    {
        // Fetch the product by ID
        return products::findOrFail($args['id']);
    }
}
