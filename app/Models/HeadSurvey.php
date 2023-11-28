<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeadSurvey extends Model
{
    use HasFactory;
    protected $table = 'head_survey';

    protected $fillable = [
        'user_id', 'komoditas_id', 'nama_toko', 'lat', 'long', 'bukti_foto'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:m:s',
        'updated_at' => 'datetime:Y-m-d H:m:s'
    ];
}
