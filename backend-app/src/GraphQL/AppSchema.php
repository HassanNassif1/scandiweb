<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Schema as GraphQLSchema;
use App\Controllers\CategoryController;
use App\Controllers\ProductController;
use App\Controllers\OrderController;
use App\Controllers\CurrencyController;

class AppSchema {
    public static function getSchema() {
        // Create controllers for fetching data
        $categoryController = new CategoryController();
        $productController = new ProductController();
        $currencyController = new CurrencyController();
        $orderController = new OrderController();

        // Define the category type to be used in products
        $categoryType = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'id' => ['type' => Type::int()],
                'name' => ['type' => Type::string()],
            ],
        ]);

        // Define other types (Currency, Attribute, Product, Order)
        $currencyType = new ObjectType([
            'name' => 'Currency',
            'fields' => [
                'id' => Type::id(),
                'label' => Type::string(),
                'symbol' => Type::string(),
            ],
        ]);

        $attributeType = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'name' => Type::string(),
                'value' => Type::string(),
            ],
        ]);

        $productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => ['type' => Type::int()],
                'name' => ['type' => Type::string()],
                'description' => ['type' => Type::string()],
                'in_stock' => ['type' => Type::boolean()],
                'brand' => ['type' => Type::string()],
                'price' => ['type' => Type::float()],
                'attributes' => [
                    'type' => Type::listOf($attributeType),
                    'resolve' => function ($product) {
                        // Handle JSONB string from PostgreSQL
                        $attributes = isset($product['attributes']) ? json_decode($product['attributes'], true) : [];
                        return is_array($attributes) ? $attributes : [];
                    },
                ],
                'image' => [
                    'type' => Type::string(), // Type::string because DB holds a JSON string
                    'resolve' => function ($product) {
                        // If image is already an array, encode it; otherwise return as is
                        return isset($product['image']) ? $product['image'] : null;
                    },
                ],
                'category_id' => ['type' => Type::int()],
                'category' => [
                    'type' => $categoryType,
                    'resolve' => function ($product) use ($categoryController) {
                        return isset($product['category_id'])
                            ? $categoryController->getCategoryById($product['category_id'])
                            : null;
                    },
                ],
            ],
        ]);

        $orderType = new ObjectType([
            'name' => 'Order',
            'fields' => [
                'id' => ['type' => Type::id()],
                'product_id' => ['type' => Type::int()],
                'product_name' => ['type' => Type::string()],
                'description' => ['type' => Type::string()],
                'total_amount' => ['type' => Type::float()],
                'attributes' => ['type' => Type::string()],
                'quantity' => ['type' => Type::int()],
            ],
        ]);

        // Define the query fields
              // Define the query fields
        $query = [
            'products' => [
                'type' => Type::listOf($productType),
                'args' => [
                    'category_name' => ['type' => Type::string()],
                ],
                'resolve' => function ($root, $args) use ($productController) {
                    return isset($args['category_name']) && !empty($args['category_name'])
                        ? $productController->getProductsByCategoryName($args['category_name'])
                        : $productController->getProducts();
                },
            ],

            // ADD THIS BLOCK BACK IN
    'productsByCategory' => [
    'type' => Type::listOf($productType),
    'args' => [
        'categoryName' => ['type' => Type::string()], // Accept camelCase
        'category_name' => ['type' => Type::string()], // Accept snake_case (to match frontend bug)
    ],
    'resolve' => function ($root, $args) use ($productController) {
        // Check which variable name is actually provided
        $name = $args['categoryName'] ?? $args['category_name'] ?? null;

        if ($name) {
            return $productController->getProductsByCategoryName($name);
        }
        
        return [];
    },
],

            'categories' => [
                'type' => Type::listOf($categoryType),
                'resolve' => function () use ($categoryController) {
                    return $categoryController->getCategories();
                },
            ],

            'currencies' => [
                'type' => Type::listOf($currencyType),
                'resolve' => function () use ($currencyController) {
                    return $currencyController->getAllCurrencies();
                },
            ],

            'productById' => [
                'type' => $productType,
                'args' => [
                    'id' => ['type' => Type::nonNull(Type::int())],
                ],
                'resolve' => function ($root, $args) use ($productController) {
                    if (isset($args['id'])) {
                        return $productController->getProductById($args['id']);
                    }
                    return null;
                },
            ],
        ];

        // Define mutations (createOrder)
        $mutation = [
            'createOrder' => [
                'type' => $orderType,
                'args' => [
                    'product_id' => ['type' => Type::nonNull(Type::int())],
                    'product_name' => ['type' => Type::nonNull(Type::string())],
                    'description' => ['type' => Type::nonNull(Type::string())],
                    'total_amount' => ['type' => Type::nonNull(Type::float())],
                    'attributes' => ['type' => Type::nonNull(Type::string())],
                    'quantity' => ['type' => Type::nonNull(Type::int())],
                ],
                'resolve' => function ($root, $args) use ($orderController) {
                    return $orderController->createOrder(
                        $args['product_id'],
                        $args['product_name'],
                        $args['description'],
                        $args['total_amount'],
                        $args['attributes'],
                        $args['quantity']
                    );
                },
            ],
        ];

        // Return the schema with the defined query and mutation
        return new GraphQLSchema([
            'query' => new ObjectType([
                'name' => 'Query',
                'fields' => $query,
            ]),
            'mutation' => new ObjectType([
                'name' => 'Mutation',
                'fields' => $mutation,
            ]),
        ]);
    }
}