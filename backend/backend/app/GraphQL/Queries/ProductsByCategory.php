<?php

namespace App\GraphQL\Queries;

use App\Models\products;

final class ProductsByCategory
{
    /**
     * @param  null  $_
     * @param  array{}  $args
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function __invoke($_, array $args)
    {
        // Retrieve the category ID from the arguments
        $categoryId = $args['category_id'];

        // Retrieve products by category ID from the database
        return products::where('category_id', $categoryId)->get();
    }
}
