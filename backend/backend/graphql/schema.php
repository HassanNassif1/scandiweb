<?php

use App\Models\productsattributes;
use App\Models\orders;
use Nuwave\Lighthouse\Schema\ResolverMap;

return [
    'resolvers' => [
        'Mutation' => [
            'createOrder' => function ($_root, array $args) {
                $order = new orders();
                $order->product_id = $args['product_id'];
                $order->product_name = $args['product_name'];
                $order->description = $args['description'];
                $order->quantity = (int)$args['quantity'];
                $order->attributes = json_decode($args['attributes']);
                $order->total_amount = (float)$args['total_amount']; 
                $order->save();
        
                // Return the created order
                return $order;
            }
        ],
        
    
        
        'Query' => [
            'productsByCategory' => function ($_root, array $args) {
                // Implement logic to fetch products by category ID
                $categoryId = $args['category_id'];
                return \App\Models\products::where('category_id', $categoryId)->get();
            },
            'productsattributes' => productsattributes::class,
            'categories' => function () {
                return \App\Models\categories::all();
            },
            'products' => function () {
                $products = \App\Models\products::all();
                
                // Fetch all prices from the database
                $prices = \App\Models\prices::all()->groupBy('product_id');
                
                // Fetch attributes for all products
                $attributes = \App\Models\attributes::all()->groupBy('product_id');
                
                // Fetch categories for all products
                $categories = \App\Models\categories::pluck('name', 'id');
                
                return $products->map(function ($product) use ($prices, $attributes, $categories) {
                    $productData = [
                        'id' => $product->id,
                        'name' => $product->name,
                        'in_stock' => $product->in_stock,
                        'description' => $product->description,
                        'category_id' => $product->category_id,
                        'brand' => $product->brand,
                        'price' => isset($prices[$product->id]) ? $prices[$product->id]->first()->amount : null,
                        'image' => $product->image,
                        'attributess' => $attributes[$product->id] ?? [], // Attributes for the product
                        'category' => isset($categories[$product->category_id]) ? ['id' => $product->category_id, 'name' => $categories[$product->category_id]] : null,
                    ];
                    
                    return $productData;
                });
            },
            
            'productByID' => function ($_root, array $args) {
                return \App\Models\products::find($args['id']);
            },
            
            'productimages' => function () {
                return \App\Models\productimages::all();
            },
            
            'prices' => function(){
                return \App\Models\prices::all();
            },
        
            
          
        ],
    ],
];
