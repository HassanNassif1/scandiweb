<?php

namespace App\Interfaces;

interface CurrenciesInterface
{
    /**
     * Fetch all categories.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllCurrencies();
}
