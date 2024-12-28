<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\Schema as GraphQLSchema;

class SchemaFactory
{
    /**
     * Create and return the GraphQL schema.
     *
     * @return GraphQLSchema
     */
    public static function create()
    {
        $productType = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => ['type' => Type::int()],
                'name' => ['type' => Type::string()],
                'in_stock' => ['type' => Type::boolean()],
                'description' => ['type' => Type::string()],
                'category' => ['type' => Type::string()],
                'attributes' => ['type' => Type::string()],
                'prices' => ['type' => Type::string()],
                'brand' => ['type' => Type::string()],
            ],
        ]);

        // Root query for fetching products
        $query = [
            'products' => [
                'type' => Type::listOf($productType),
                'resolve' => function () {
                    return (new \App\Repositories\ProductRepository())->getAllProducts();
                }
            ]
        ];

        return new GraphQLSchema([ // Create the schema object and return it
            'query' => new ObjectType([
                'name' => 'Query',
                'fields' => $query
            ])
        ]);
    }
}
