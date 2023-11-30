<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MasterDataController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


// LOGIN
Route::get('/', [AuthController::class, 'showFormLogin'])->name('login')->middleware('guest');
Route::post('/auth', [AuthController::class, 'Login']);
Route::get('/logout', [AuthController::class, 'logout']);
// DASHBOARD
Route::get('/home', [MasterDataController::class, 'dashboard'])->middleware('auth');
Route::get('/dashboard', [MasterDataController::class, 'dashboard'])->middleware('auth');
//MENGAMBIL WILAYAH ID
Route::get('/getWilayahId', [MasterDataController::class, 'get_wilayah_id'])->middleware('auth');
// PROSES SIMPAN HEAD SURVEY
Route::post('/simpanHeadSurvey', [MasterDataController::class, 'simpan_head_survey'])->middleware('auth');
//AMBIL DATA HARGA BARANG LAMA
Route::get('/cekHargaLama', [MasterDataController::class, 'cek_harga_lama'])->middleware('auth');
// AMBIL DATA HARGA BARANG DI DETAIL SURVEY
Route::get('/cekCurrentHarga', [MasterDataController::class, 'cek_current_harga'])->middleware('auth');
// PROSES SIMPAN DETAIL SURVEY
Route::post('/simpanDetailSurvey', [MasterDataController::class, 'simpan_detail_survey'])->middleware('auth');
// PROSES UPDATE DETAIL SURVEY
Route::post('/updateDetailSurvey', [MasterDataController::class, 'update_detail_survey'])->middleware('auth');
//CARI BARANG
Route::get('/cariBarang', [MasterDataController::class, 'cari_barang'])->middleware('auth');
//CARI KOMODITAS
Route::get('/cariKomoditas', [MasterDataController::class, 'cari_komoditas'])->middleware('auth');
//RESET HEAD SURVEY
Route::get('/resetHeadSurvey', [MasterDataController::class, 'reset_head_survey'])->middleware('auth');
//HIGHLIGHT BARANG
Route::get('/highlightBarang', [MasterDataController::class, 'highlight_barang'])->middleware('auth');
