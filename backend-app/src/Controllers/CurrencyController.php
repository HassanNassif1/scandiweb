<?php

namespace App\Controllers;

use App\Repositories\CurrencyRepository;

class CurrencyController {
    private $currencyRepo;

    public function __construct() {
        $this->currencyRepo = new CurrencyRepository();
    }

    public function getAllCurrencies() {
        return $this->currencyRepo->getAllCurrencies(); // Fetch currencies from repository
    }

    public function getCurrencyById($id) {
        return $this->currencyRepo->getCurrencyById($id); // Fetch single currency by ID
    }
}
