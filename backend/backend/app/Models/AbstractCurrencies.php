<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbstractCurrencies extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'label', 'symbol'];

    public function currenciable()
    {
        return $this->morphTo();
    }
}
