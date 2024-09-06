<?php
namespace App\GraphQL\Queries;

use App\Models\productsattributes;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ProductsAttributeQuery
{
    public function __invoke($_root, array $args)
    {
        return productsattributes::find($args['id']);
    }
}