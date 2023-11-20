<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailSurvey extends Model
{
    use HasFactory;
    protected $table = 'detail_survey';

    protected $fillable = [
        'survey_id', 'barang_id', 'kecamatan_id', 'harga_lama', 'harga_baru'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:m:s',
        'updated_at' => 'datetime:Y-m-d H:m:s'
    ];
}
