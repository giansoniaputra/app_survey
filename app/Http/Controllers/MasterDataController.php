<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kecamatan;
use App\Models\Komoditas;
use App\Models\HeadSurvey;
use Illuminate\Support\Str;
use App\Models\DetailSurvey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MasterDataController extends Controller
{
    public function dashboard()
    {
        return view('dashboard.index', [
            'kecamatan' => Kecamatan::orderBy('kecamatan', 'asc')->get(),
            'komoditas' => Komoditas::orderBy('komoditas', 'asc')->get(),
            'barang' => Barang::orderBy('nama_barang', 'asc')->get(),
        ]);
    }

    public function simpan_head_survey(Request $request)
    {
        $base_Image = $request->upload_gambar;
        $jenis_file = explode(":", $request->upload_gambar);
        $jenis_file2 = explode("/", $jenis_file[1]);
        $jenis_file3 = explode(";", $jenis_file2[1]);
        $jenis_foto = $jenis_file3[0];
        if ($jenis_foto == 'jpeg') {
            $base_Image = str_replace('data:image/jpeg;base64,', '', $base_Image);
        } else if ($jenis_foto == 'jpg') {
            $base_Image = str_replace('data:image/jpg;base64,', '', $base_Image);
        } else if ($jenis_foto == 'png') {
            $base_Image = str_replace('data:image/png;base64,', '', $base_Image);
        }
        $base_Image = str_replace(' ', '+', $base_Image);
        $name_Image = Str::random(40) . '.' . 'png';
        File::put(storage_path() . '/app/public/bukti_foto/' . $name_Image, base64_decode($base_Image));
        $data = [
            'user_id' => auth()->user()->id,
            'komoditas_id' => $request->komoditas,
            'nama_toko' => $request->nama_toko,
            'bukti_foto' => $name_Image
        ];
        HeadSurvey::create($data);
        //ambil data yang baru dimasukan
        $latest = HeadSurvey::latest()->first();
        return response()->json(['current_id' => $latest->id]);
        // return response()->json(['current_id' => 1]);
    }

    public function cek_harga_lama(Request $request)
    {
        $cek = Barang::where('id', $request->id)->first();
        return response()->json(['success' => $cek]);
    }

    public function simpan_detail_survey(Request $request)
    {
        $data = [
            'survey_id' => $request->survey_id,
            'barang_id' => $request->barang,
            'kecamatan_id' => $request->kecamatan,
            'harga_lama' => preg_replace('/[,]/', '', $request->harga_barang_lama),
            'harga_baru' => preg_replace('/[,]/', '', $request->harga_barang_baru),
        ];
        DetailSurvey::create($data);
        return response()->json(['success' => 'Data Berhasil Di Simpan!']);
    }

    public function update_detail_survey(Request $request)
    {
        $data = [
            'harga_baru' => preg_replace('/[,]/', '', $request->harga_barang_baru),
        ];
        DetailSurvey::where('id', $request->current_id)->update($data);
        return response()->json(['success' => 'Data Berhasil Di Update!']);
    }

    public function cari_barang(Request $request)
    {
        $results = DB::table('barang')
            ->where('nama_barang', 'LIKE', '%' . $request->nama_barang . '%')
            ->get();
        return response()->json(['data' => $results]);
    }
    public function highlight_barang(Request $request)
    {
        $cek = DB::table('barang as a')
            ->join('detail_survey as b', 'a.id', '=', 'b.barang_id', 'left')
            ->select('a.*', 'b.id as bid', 'b.kecamatan_id')
            ->where('a.nama_barang', 'LIKE', '%' . $request->nama_barang . '%')
            ->get();
        $i = 1;
        foreach ($cek as $row) {
            if ($row->kecamatan_id == $request->kecamatan_id) {
                echo '
                <button class="btn btn-primary btn-sm pilih-barang-update" type="button" data-id="' . $row->id . '">' . $i++ . ' ' . $row->nama_barang . '  </button>
                ';
            } else {
                echo '
                <button class="btn btn-success btn-sm pilih-barang" type="button" data-id="' . $row->id . '">' . $i++ . ' ' . $row->nama_barang . '  </button>
                ';
            }
        }
    }

    public function cek_current_harga(Request $request)
    {
        $cek = DB::table('detail_survey as a')
            ->join('barang as b', 'a.barang_id', '=', 'b.id')
            ->select('a.*', 'b.nama_barang')
            ->where('a.barang_id', $request->id)
            ->where('a.kecamatan_id', $request->kecamatan_id)
            ->first();
        return response()->json(['success' => $cek]);
    }
}
