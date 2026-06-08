<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\GraphQL\AppSchema;
use GraphQL\GraphQL;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

header('Content-Type: application/json');

$schema = AppSchema::getSchema();

// Read raw input safely
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

// ❗ FIX: validate input BEFORE using it
if (!$input || !isset($input['query'])) {
    echo json_encode([
        "errors" => [
            ["message" => "No GraphQL query received"]
        ]
    ]);
    exit;
}

$query = $input['query'];
$variables = $input['variables'] ?? null;

try {
    $result = GraphQL::executeQuery(
        $schema,
        $query,
        null,
        null,
        $variables
    );

    echo json_encode($result->toArray());

} catch (Throwable $e) {
    echo json_encode([
        "errors" => [
            ["message" => $e->getMessage()]
        ]
    ]);
}