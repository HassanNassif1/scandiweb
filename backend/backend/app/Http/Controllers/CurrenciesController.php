<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\currencies;
use App\Interfaces\CurrenciesInterface;

class CurrenciesController extends Controller implements CurrenciesInterface
{
 
    public function getAllCurrencies()
    {
        return currencies::all();
    }

 
    public function fetchCurrencies()
    {
        // Fetch all categories using the method from the interface
        $Currency = $this->getAllCurrencies();

        // Return the fetched categories as JSON response
        return response()->json($Currency);
    }
}
