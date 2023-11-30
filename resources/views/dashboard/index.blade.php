@extends('layouts.main')
@section('container')
<style>
    #image {
        display: block;
        max-width: 100%;
    }

    .preview {
        overflow: hidden;
        width: 160px;
        height: 160px;
        margin: 10px;
        border: 1px solid red;
    }

</style>
<div class="card mt-2" id="card-pertama" style="height: 80vh;">
    <div class="row mt-2 mx-1">
        <div class="col-sm-12">
            <div class="mb-3">
                <select class="form-control select2" data-toggle="select2" id="kecamatan">
                    <option value="" selected disabled>Pilih Kecamatan</option>
                    @foreach ($kecamatan as $row)
                    <option value="{{ $row->id }}">{{ $row->kecamatan }}</option>
                    @endforeach
                </select>
            </div>
        </div>
    </div>
    <div class="row mt-2 mx-1">
        <div class="col-sm-12">
            <label>Pilih Komoditas</label>
        </div>
    </div>
    <div class="row mt-2 mx-1">
        <div class="col-sm-12">
            <div class="mb-3">
                <input type="text" id="cari-komoditas" class="form-control" placeholder="Cari Komoditas">
            </div>
        </div>
    </div>
    <div class="row mt-2 mx-1" style="overflow-y: auto;">
        <div class="col-sm-12 d-grid gap-2 mb-3" id="komoditas">
            <input type="hidden" name="komoditas_id">
            @php
            $i = 1;
            @endphp
            <div class="render_komoditas d-grid gap-2 mb-3">
                @foreach ($komoditas as $row)
                <button class="btn btn-success btn-sm pilih-komoditas" type="button" data-id="{{ $row->id }}">{{ $i++ . '. ' . $row->komoditas }}</button>
                @endforeach
            </div>
        </div>
    </div>
</div>
{{-- DATA KECAMATAN, KOMODITAS dan GAMBAR AKAN DISIMPAN TERLEBIH DAHULU --}}
<div class="card mt-2 d-none" id="card-kedua">
    <form action="javascript:;" id="form-identitas">
        @csrf
        <input type="hidden" name="komoditas">
        <input type="hidden" name="upload_gambar">
        <div class="row mt-2 mx-1">
            <div class="col-sm-12">
                <div class="mb-3">
                    <label for="nama_toko">Nama Toko</label>
                    <input type="text" class="form-control" name="nama_toko" id="nama_toko" placeholder="Masukan Nama Toko">
                </div>
                <div class="mb-3" id="rules-gambar">
                    <label for="gambar">Upload Bukti Kunjungan</label>
                    <input type="file" accept="image/*" capture="camera" id="gambar" class="form-control">
                </div>
                <div class="mb-3 d-flex justify-content-center">
                    <img src="/upload.png" alt="" id="image-gambar" class="img-fluid" style="display:block" width="200vh">
                </div>
                <div class="d-grid gap-2 mb-3">
                    <button class="btn btn-success" type="button" id="simpan-data-toko">SIMPAN</button>
                </div>
            </div>
        </div>
    </form>
</div>
{{-- ./DATA KECAMATAN, KOMODITAS dan GAMBAR AKAN DISIMPAN TERLEBIH DAHULU --}}
<form action="javascript:;" id="form-survey">
    <div class="card mt-2 d-none" id="card-kedua-setengah" style="height: 80vh;">
        @csrf
        {{-- INPUT UNTUK ID DARI KECAMATAN DAN TOKO SERTA FOTO YANG TELAH DISIMPAN --}}
        <input type="hidden" name="survey_id">
        <input type="hidden" name="wilayah_id">
        <input type="hidden" name="kecamatan">
        {{-- ./INPUT UNTUK ID DARI KECAMATAN DAN TOKO SERTA FOTO YANG TELAH DISIMPAN --}}
        <div class="row mt-2 mx-1">
            <div class="col-sm-12">
                <div class="mb-3">
                    <label>Barang</label>
                    <input type="text" id="cari-barang" class="form-control" placeholder="Cari Barang">
                </div>
            </div>
        </div>
        <div class="row mt-2 mx-1" style="overflow-y: auto;">
            <div class="col-sm-12">
                <div class="mb-3">
                    <div class="mb-3" id="barang">
                        <input type="hidden" name="barang">
                        @php
                        $j = 1;
                        @endphp
                        <div id="refresh-barang" class="d-grid gap-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="card mt-2 d-none" id="card-ketiga">
        <div class="row mt-2 mx-1">
            <div class="col-sm-12">
                <div class="mb-3">
                    <label for="nama_barang">Nama Barang</label>
                    <input type="text" class="form-control" name="nama_barang" id="nama_barang" placeholder="Masukan Nama Barang" readonly>
                    <div class="invalid-feedback">
                        <small>Nama barang tidak boleh kosong</small>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="harga_barang_lama">Harga Barang Lama</label>
                    <input type="text" class="form-control money" name="harga_barang_lama" pattern="[0-9,]*" onkeypress="hanyaNomor(event)" id="harga_barang_lama" placeholder="Masukan Harga Barang Lama" readonly>
                    <div class="invalid-feedback">
                        <small>Harga barang tidak boleh kosong</small>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="harga_barang_baru">Harga Barang Baru</label>
                    <input type="text" class="form-control money" name="harga_barang_baru" pattern="[0-9,]*" onkeypress="hanyaNomor(event)" id="harga_barang_baru" placeholder="Masukan Harga Barang Baru">
                    <div class="invalid-feedback">
                        <small>Harga barang tidak boleh kosong</small>
                    </div>
                </div>
                <div class="d-grid gap-2 mb-3" id="btn-action">
                </div>
            </div>
        </div>
    </div>
</form>
<div class="card mt-2 text-center px-2 fixed-bottom container bg-transparent" id="btn-back">

</div>

@include('dashboard.modal-cropper')
{{-- <script src="/node_modules/image-compressor/image-compressor.js" type="module"></script> --}}
<script src="/page-script/script.js"></script>
@endsection
