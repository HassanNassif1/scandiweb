<?php

namespace App\Interfaces;

interface CurrencyInterface {
    public function getAllCurrencies();
    public function getCurrencyById($id);
}
