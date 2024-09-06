<?php

namespace App\Repositories;

use App\Interfaces\CurrenciesInterface;
use App\Models\currencies;

class CurrenciesRepository implements CurrenciesInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCurrencies()
    {
        // Fetch all categories
        return currencies::all();
    }
}
