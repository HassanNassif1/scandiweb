<?php

namespace App\GraphQL\Resolvers;

use App\Models\productsattributes;

class ProductAttributesResolver
{
    public function productsattributes($root, $args)
    {
        // Fetch the product by ID
        return productsattributes::findOrFail($args['id']);
    }
}
