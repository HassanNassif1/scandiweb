<?php 
namespace App\GraphQL\Scalars;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Language\AST\Node;
use GraphQL\Error\Error;
use GraphQL\Utils\Utils;

class JSON extends ScalarType
{
    // Scalar type name
    public $name = 'JSON';

    /**
     * Serialize a PHP value to send to a client.
     *
     * @param  mixed  $value
     * @return mixed
     */
    public function serialize($value)
    {
        return $value; // JSON is already serialized
    }

    /**
     * Parse a client input to convert into a PHP value.
     *
     * @param  mixed  $value
     * @return mixed
     */
    public function parseValue($value)
    {
        if (!is_array($value) && !is_object($value)) {
            throw new Error('Cannot parse JSON value: ' . Utils::printSafe($value));
        }

        return $value;
    }

    /**
     * Parse a query to convert the AST into a PHP value.
     *
     * @param  \GraphQL\Language\AST\Node  $valueNode
     * @param  array|null  $variables
     * @return mixed
     */
    public function parseLiteral($valueNode, ?array $variables = null)
    {
        throw new Error('Query error: Cannot parse literal JSON value');
    }
}
