<?php
use GraphQL\Type\SchemaConfig;
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Include Composer's autoload file
require '../vendor/autoload.php';

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\GraphQL;

// Database connection
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=scandi_web', 'root', '123456');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Define types




    $orderType = new ObjectType([
        'name' => 'orders',
        'fields' => [
            'id' => Type::nonNull(Type::int()),
            'product_id' => Type::nonNull(Type::int()),
            'product_name' => Type::nonNull(Type::string()),
            'description' => Type::nonNull(Type::string()),
            'total_amount' => Type::nonNull(Type::float()),
            'attributes' => Type::listOf(Type::string()),
            'quantity' => Type::nonNull(Type::int()),
        ],
    ]);
    
    $mutationType = new ObjectType([
        'name' => 'Mutation',
        'fields' => [
            'createOrder' => [
                'type' => $orderType,
                'args' => [
                    'product_id' => Type::nonNull(Type::int()),  // Change from ID! to int!
                    'product_name' => Type::nonNull(Type::string()),
                    'description' => Type::nonNull(Type::string()),
                    'total_amount' => Type::nonNull(Type::float()),
                    'attributes' => Type::nonNull(Type::listOf(Type::nonNull(Type::string()))), // Change to [String!]!
                    'quantity' => Type::nonNull(Type::int()),
                ],
                'resolve' => function ($rootValue, $args) use ($pdo) {
                    // Prepare SQL for inserting an order
                    $stmt = $pdo->prepare("
                        INSERT INTO orders (product_id, product_name, description, total_amount, attributes, quantity)
                        VALUES (:product_id, :product_name, :description, :total_amount, :attributes, :quantity)
                    ");
                    
                    // Convert attributes array to a comma-separated string for storage
                    $attributesString = implode(',', $args['attributes']);
                    
                    // Execute the statement
                    $stmt->execute([
                        'product_id' => $args['product_id'],
                        'product_name' => $args['product_name'],
                        'description' => $args['description'],
                        'total_amount' => $args['total_amount'],
                        'attributes' => $attributesString,
                        'quantity' => $args['quantity'],
                    ]);
    
                    // Fetch the last inserted order ID
                    $orderId = $pdo->lastInsertId();
    
                    // Return the newly created order
                    return [
                        'id' => (int) $orderId,
                        'product_id' => $args['product_id'],
                        'product_name' => $args['product_name'],
                        'description' => $args['description'],
                        'total_amount' => $args['total_amount'],
                        'attributes' => $args['attributes'], // Return the attributes as an array
                        'quantity' => $args['quantity'],
                    ];
                },
            ],
        ],
    ]);
 
    $categoryType = new ObjectType([
        'name' => 'Category',
        'fields' => [
            'id' => Type::nonNull(Type::int()),
            'name' => Type::nonNull(Type::string()),
        ],
    ]);

    $attributeType = new ObjectType([
        'name' => 'Attribute',
        'fields' => [
            'id' => Type::nonNull(Type::int()),
            'name' => Type::nonNull(Type::string()),
            'type' => Type::nonNull(Type::string()),
            'values' => Type::listOf(Type::string()),
        ],
    ]);
    

    $productType = new ObjectType([
        'name' => 'Product',
        'fields' => [
            'id' => Type::nonNull(Type::int()),
            'name' => Type::nonNull(Type::string()),
            'in_stock' => Type::nonNull(Type::boolean()),
            'description' => Type::nonNull(Type::string()),
            'category_id' => Type::nonNull(Type::int()),
            'brand' => Type::nonNull(Type::string()),
            'price' => Type::float(),
            'image' => Type::nonNull(Type::string()),
          'attributes' => [
    'type' => Type::listOf($attributeType),
    'resolve' => function($product) use ($pdo) {
        // Prepare the SQL to get attributes associated with the product
        $stmt = $pdo->prepare("
            SELECT a.id AS attribute_id, a.name, a.type, pa.item_displayValue 
            FROM products_attributes pa 
            JOIN attributes a ON a.id = pa.attribute_id 
            WHERE pa.product_id = :product_id
        ");
        $stmt->execute(['product_id' => $product['id']]);
        $attributes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Use an associative array to filter out duplicates
        $uniqueAttributes = [];

        foreach ($attributes as $attr) {
            // Create a unique ID for each attribute based on attribute ID
            $uniqueID = $attr['attribute_id'];

            // Initialize the attribute if it doesn't exist
            if (!isset($uniqueAttributes[$uniqueID])) {
                $uniqueAttributes[$uniqueID] = [
                    'id' => (int) $uniqueID,
                    'name' => $attr['name'],
                    'type' => $attr['type'],
                    'values' => array_unique(array_filter(explode(',', $attr['item_displayValue']))), // Ensure unique values
                ];
            } else {
                // If the attribute already exists, only add the value if it's unique and belongs to this product
                $newValues = array_unique(array_filter(explode(',', $attr['item_displayValue']))); // Split, filter, and ensure unique new values
                foreach ($newValues as $value) {
                    // Check if the value is already in the existing values to prevent duplicates
                    if (!in_array($value, $uniqueAttributes[$uniqueID]['values'])) {
                        $uniqueAttributes[$uniqueID]['values'][] = $value; // Add the new unique value
                    }
                }
            }
        }

        // Return the unique attributes as an array
        return array_values($uniqueAttributes);
    },
],

            'categories' => [
                'type' => $categoryType,
                'resolve' => function($product) use ($pdo) {
                    $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = :id");
                    $stmt->execute(['id' => $product['category_id']]);
                    return $stmt->fetch(PDO::FETCH_ASSOC);
                },
            ],
        ],
    ]);
    
    
    // Define the Query type
    $queryType = new ObjectType([
        'name' => 'Query',
        'fields' => [
            'categories' => [
                'type' => Type::listOf($categoryType),
                'resolve' => function() use ($pdo) {
                    $stmt = $pdo->query("SELECT id, name FROM categories");
                    return $stmt->fetchAll(PDO::FETCH_ASSOC);
                },
            ],
            'products' => [
                'type' => Type::listOf($productType),
                'resolve' => function() use ($pdo) {
                    $stmt = $pdo->query("SELECT * FROM products");
                    return $stmt->fetchAll(PDO::FETCH_ASSOC);
                },
            ],
            'product' => [
                'type' => $productType,
                'args' => [
                    'id' => Type::nonNull(Type::int()),
                ],
                'resolve' => function($rootValue, $args) use ($pdo) {
                    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
                    $stmt->execute(['id' => $args['id']]);
                    return $stmt->fetch(PDO::FETCH_ASSOC);
                },
            ],
            'productsByCategory' => [
                'type' => Type::listOf($productType),
                'args' => [
                    'category_id' => Type::nonNull(Type::int()),
                ],
                'resolve' => function($rootValue, $args) use ($pdo) {
                    // Ensure category_id is provided
                    if (!isset($args['category_id'])) {
                        throw new Exception('category_id argument is required');
                    }
                    $stmt = $pdo->prepare("SELECT * FROM products WHERE category_id = :category_id");
                    $stmt->execute(['category_id' => $args['category_id']]);
                    return $stmt->fetchAll(PDO::FETCH_ASSOC);
                },
            ],
        ],
    ]);

 // Create the Schema using SchemaConfig
$schema = new Schema(SchemaConfig::create()
->setQuery($queryType) // Define the root query
->setMutation($mutationType) // Define the root mutation
);


    // Handle GraphQL requests
    $input = json_decode(file_get_contents('php://input'), true);
    $query = $input['query'] ?? '';

    // Execute the query
    $result = GraphQL::executeQuery($schema, $query);
    $output = $result->toArray();



    
    // Set the content type to JSON
    header('Content-Type: application/json');
    echo json_encode($output);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
