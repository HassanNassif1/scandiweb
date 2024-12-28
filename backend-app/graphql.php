<?php

require_once __DIR__ . '/vendor/autoload.php';  // Adjust the path as needed

use App\GraphQL\AppSchema;
use GraphQL\GraphQL;
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Create the GraphQL schema
$schema = AppSchema::getSchema();

// Read the incoming request's JSON body
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// Get the query and variables from the input
$query = $input['query'] ?? '';
$variables = $input['variables'] ?? null;

// Execute the GraphQL query
$result = GraphQL::executeQuery($schema, $query, null, null, $variables);

// Convert the result to an array and output it as JSON
$output = $result->toArray();
header('Content-Type: application/json');
echo json_encode($output);
