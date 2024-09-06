<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbstractCategories extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name'];

    public function categorizable()
    {
        return $this->morphTo();
    }
}
