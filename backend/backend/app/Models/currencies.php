<?php

namespace App\Models;

class currencies extends AbstractCurrencies
{
    /**
     * Get details of the product.
     *
     * @return string
     */
    public function getCurrenciesDetails()
    {
        return "ID: {$this->id}, Label: {$this->label}, Symbol: {$this->symbol}";
    }

   
}
