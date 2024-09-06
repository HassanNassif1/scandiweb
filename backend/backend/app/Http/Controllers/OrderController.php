<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\orders;
use App\Interfaces\OrderInterface;

class OrderController extends Controller implements OrderInterface
{
 
    public function getAllOrders()
    {
        return orders::all();
    }

 
    public function fetchOrders()
    {
        // Fetch all categories using the method from the interface
        $Order = $this->getAllOrders();

        // Return the fetched categories as JSON response
        return response()->json($Order);
    }
    
}
