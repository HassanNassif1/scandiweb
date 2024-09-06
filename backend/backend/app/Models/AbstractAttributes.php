<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AbstractAttributes extends Model
{
    use HasFactory;

    protected $fillable = ['id', 'name', 'type'];

    public function attributable()
    {
        return $this->morphTo();
    }
}
