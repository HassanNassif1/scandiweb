<?php

use App\Http\Controllers\productimages;
use App\Models\currencies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CurrenciesController;
use \GraphQL\GraphQL;

// Define your regular routes
Route::get('categories', [CategoriesController::class, 'fetchCategories']);
Route::get('products', [ProductController::class, 'fetchProducts']);

Route::get('productimages', [productimages::class, 'fetchImages']);
Route::get('orders', [OrderController::class, 'fetchOrders']);
Route::get('currencies', [CurrenciesController::class, 'fetchCurrencies']);
Route::get('/products/{id}', [ProductController::class, 'fetchProductsByID']);
// Route::post('/graphql', '\Nuwave\Lighthouse\Support\Http\Controllers\GraphQL@query');
// Define GraphQL route with CORS middleware
// Route::post('/graphql', [GraphQL::class, 'execute'])->middleware('cors');

