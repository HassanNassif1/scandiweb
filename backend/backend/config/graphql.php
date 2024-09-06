<?php

use Nuwave\Lighthouse\Schema\ResolverMap;

return [
    'resolvers' => [
        'Query' => [
            'categories' => function () {
                // Fetch all categories from the database
                return \App\Models\categories::all();
            },
            
            'products' => function ($root, $args) {
                // If ID is provided, fetch and return the product by its ID
                if (isset($args['id'])) {
                    return \App\Models\products::find($args['id']);
                }
                
                // If no ID is provided, return all products
                return \App\Models\products::all();
            },
            
            'productimages' => function () {
                // Fetch all images from the database
                $images = \App\Models\productimages::all();
            
                // Transform the images to match the schema
                return $images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'product_id' => $image->product_id,
                        'image_url' => $image->image_url,
                    ];
                });
            },
            
            'prices' => function(){
                return \App\Models\prices::all();
            },
        ],
    ],
];
