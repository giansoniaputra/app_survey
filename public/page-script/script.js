// JQUERY------------------------------------------------------
$(document).ready(function () {
    // KETIKA KECAMATAN DIPILIH
    $("#kecamatan").on("change", function () {
        $("input[name='kecamatan']").val($(this).val());
        let kecamatan_id = $("input[name='kecamatan']").val();
        refreshBarang(kecamatan_id)
    })
    //KETIKA KOMODITAS DIPILIH
    $("#komoditas").on("click", ".pilih-komoditas", function () {
        if ($("#kecamatan").val() == null) {
            Swal.fire({
                title: "Warning",
                text: "Silahkan Pilih Kecamatan!",
                icon: "warning"
            });
        } else {
            $("input[name='komoditas']").val($(this).attr("data-id"));
            $("#card-pertama").addClass("d-none");
            $("#card-kedua").removeClass("d-none");
        }
    })

    // KETIKA TOMBOL SIMPAN PADA NAMA TOKO dan UPLOAD GAMBAR DI TEKAN
    $("#simpan-data-toko").on("click", function () {
        $("#spinner").html(loader)
        if ($("#gambar").val() == "" || $("#nama_toko").val() == "") {
            $("#spinner").html("")
            if ($("#gambar").val() == "") {
                Swal.fire({
                    title: "Warning",
                    text: "Silahkan Upload Gambar!",
                    icon: "warning"
                });
            }
            if ($("#nama_toko").val() == "") {
                Swal.fire({
                    title: "Warning",
                    text: "Silahkan Isi Nama Toko!",
                    icon: "warning"
                });
            }
        } else {
            //SCRIPT UNTUK SIMPAN NAMA TOKO DAN FOTO
            let formdata = $('form[id="form-identitas"]').serializeArray();
            let data = {}
            $(formdata).each(function (index, obj) {
                data[obj.name] = obj.value;
            });
            // console.log(formdata);
            $.ajax({
                data: $('form[id="form-identitas"]').serialize(),
                url: "/simpanHeadSurvey",
                type: "POST",
                dataType: 'json',
                success: function (response) {
                    $("#spinner").html("")
                    $("input[name='survey_id']").val(response.current_id);
                    $("#card-kedua").addClass("d-none");
                    $("#card-kedua-setengah").removeClass("d-none");
                }
            });
        }
    })

    // KETIKA BARANG DIPILIH (YANG TIDAK DI HIGHLIGHT)
    $("#barang").on("click", ".pilih-barang", function () {
        $.ajax({
            data: { id: $(this).attr("data-id") },
            url: "/cekHargaLama",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $("input[name='nama_barang']").val(response.success.nama_barang);
                $("input[name='harga_barang_lama']").val(
                    new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    })
                        .format(response.success.harga)
                        .replace("Rp", "")
                        .replace(/\./g, ",")
                )
            }
        });
        $("#btn-action").html(`<button class="btn btn-success btn-sm" type="button" id="simpan">SIMPAN</button>`)
        $("input[name='barang']").val($(this).attr("data-id"))
        $("#card-kedua-setengah").addClass("d-none");
        $("#card-ketiga").removeClass("d-none");
    })

    // KETIKA BARANG DIPILIH (YANG DI HIGHLIGHT)
    $("#barang").on("click", ".pilih-barang-update", function () {
        let kecamatan_id = $("input[name='kecamatan']").val();
        $.ajax({
            data: {
                id: $(this).attr("data-id"),
                kecamatan_id: kecamatan_id
            },
            url: "/cekCurrentHarga",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $("input[name='nama_barang']").val(response.success.nama_barang);
                $("input[name='harga_barang_lama']").val(
                    new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    })
                        .format(response.success.harga_lama)
                        .replace("Rp", "")
                        .replace(/\./g, ",")
                )
                $("input[name='harga_barang_baru']").val(
                    new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    })
                        .format(response.success.harga_baru)
                        .replace("Rp", "")
                        .replace(/\./g, ",")
                )
                $("#btn-action").html(`
                <button class="btn btn-success btn-sm" type="button" id="update">UPDATE</button>
                <input type="hidden" name="current_id" value="${response.success.id}">
                `)
            }
        });
        $("input[name='barang']").val($(this).attr("data-id"))
        $("#card-kedua-setengah").addClass("d-none");
        $("#card-ketiga").removeClass("d-none");
    })

    // MEMASUKAN DATA HARGA BARU
    $("#btn-action").on("click", "#simpan", function (event) {
        $("#spinner").html(loader)
        if ($("#nama_barang").val() == "" || $("#harga_barang_lama").val() == "" || $("#harga_barang_baru").val() == "") {
            $("#spinner").html("")
            if ($("#nama_barang").val() == "") {
                $("#nama_barang").addClass("is-invalid");
                event.preventDefault();
            }
            if ($("#harga_barang_lama").val() == "") {
                $("#harga_barang_lama").addClass("is-invalid");
                event.preventDefault();
            }
            if ($("#harga_barang_baru").val() == "") {
                $("#harga_barang_baru").addClass("is-invalid");
                event.preventDefault();
            }
        } else {
            //SCRIPT UNTUK SIMPAN NAMA TOKO DAN FOTO
            let formdata = $('form[id="form-survey"]').serializeArray();
            let data = {}
            $(formdata).each(function (index, obj) {
                data[obj.name] = obj.value;
            });
            // console.log(formdata);
            $.ajax({
                data: $('form[id="form-survey"]').serialize(),
                url: "/simpanDetailSurvey",
                type: "POST",
                dataType: 'json',
                success: function (response) {
                    $("#spinner").html("")
                    let kecamatan_id = $("input[name='kecamatan']").val();
                    // RENDER NAMA BARANG
                    $.ajax({
                        data: {
                            nama_barang: "",
                        },
                        url: "/cariBarang",
                        type: "GET",
                        dataType: 'json',
                        success: function (response) {
                            $.ajax({
                                data: {
                                    kecamatan_id: kecamatan_id,
                                    nama_barang: ""
                                },
                                url: "/highlightBarang",
                                success: function (response2) {
                                    $("#refresh-barang").html(response2)
                                }
                            });
                        }
                    });
                    //LAKUKAN SESUATU KETIKA RESPON DIKEMBALIKAN
                    //KEMBALI LAGI KE HALAMAN UPLOAD PHOTO
                    $("#cari-barang").val("");
                    $("input[name='upload_gambar']").val("");
                    $("input[name='nama_toko']").val("");
                    $("input[name='survey_id']").val("");
                    $("input[name='barang']").val("");
                    $("input[name='nama_barang']").val("");
                    $("input[name='harga_barang_lama']").val("");
                    $("input[name='harga_barang_baru']").val("");
                    $("#gambar").val("");
                    $("#gambar").next(".custom-file-label").html("Pilih gambar");
                    $("#image-gambar").attr("src", "/upload.png");
                    $("#card-kedua").removeClass("d-none");
                    $("#card-ketiga").addClass("d-none");
                    Swal.fire({
                        title: "Success",
                        text: response.success,
                        icon: "success"
                    });
                }
            });

        }
    })
    // MENGUPDATE DATA HARGA SURVEY
    $("#btn-action").on("click", "#update", function (event) {
        $("#spinner").html(loader)
        if ($("#nama_barang").val() == "" || $("#harga_barang_lama").val() == "" || $("#harga_barang_baru").val() == "") {
            $("#spinner").html("")
            if ($("#nama_barang").val() == "") {
                $("#nama_barang").addClass("is-invalid");
                event.preventDefault();
            }
            if ($("#harga_barang_lama").val() == "") {
                $("#harga_barang_lama").addClass("is-invalid");
                event.preventDefault();
            }
            if ($("#harga_barang_baru").val() == "") {
                $("#harga_barang_baru").addClass("is-invalid");
                event.preventDefault();
            }
        } else {
            //SCRIPT UNTUK SIMPAN NAMA TOKO DAN FOTO
            let formdata = $('form[id="form-survey"]').serializeArray();
            let data = {}
            $(formdata).each(function (index, obj) {
                data[obj.name] = obj.value;
            });
            // console.log(formdata);
            $.ajax({
                data: $('form[id="form-survey"]').serialize(),
                url: "/updateDetailSurvey",
                type: "POST",
                dataType: 'json',
                success: function (response) {
                    $("#spinner").html("")
                    let kecamatan_id = $("input[name='kecamatan']").val();
                    // RENDER NAMA BARANG
                    $.ajax({
                        data: {
                            nama_barang: "",
                        },
                        url: "/cariBarang",
                        type: "GET",
                        dataType: 'json',
                        success: function (response) {
                            $.ajax({
                                data: {
                                    kecamatan_id: kecamatan_id,
                                    nama_barang: ""
                                },
                                url: "/highlightBarang",
                                success: function (response2) {
                                    $("#refresh-barang").html(response2)
                                }
                            });
                        }
                    });
                    //LAKUKAN SESUATU KETIKA RESPON DIKEMBALIKAN
                    //KEMBALI LAGI KE HALAMAN UPLOAD PHOTO
                    $("#cari-barang").val("");
                    $("input[name='upload_gambar']").val("");
                    $("input[name='nama_toko']").val("");
                    $("input[name='survey_id']").val("");
                    $("input[name='barang']").val("");
                    $("input[name='nama_barang']").val("");
                    $("input[name='harga_barang_lama']").val("");
                    $("input[name='harga_barang_baru']").val("");
                    $("#gambar").val("");
                    $("#gambar").next(".custom-file-label").html("Pilih gambar");
                    $("#image-gambar").attr("src", "/upload.png");
                    $("#card-kedua").removeClass("d-none");
                    $("#card-ketiga").addClass("d-none");
                    Swal.fire({
                        title: "Success",
                        text: response.success,
                        icon: "success"
                    });
                }
            });

        }
    })

    // RESET INVALID
    $("#nama_barang").on("click", function () {
        $(this).removeClass("is-invalid");
    })
    $("#harga_barang_lama").on("click", function () {
        $(this).removeClass("is-invalid");
    })
    $("#harga_barang_baru").on("click", function () {
        $(this).removeClass("is-invalid");
    })

    // PENCARIAN BARANG
    $("#cari-barang").on('keyup', function () {
        let kecamatan_id = $("input[name='kecamatan']").val();
        $.ajax({
            data: { nama_barang: $(this).val() },
            url: "/cariBarang",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                // RENDER NAMA BARANG
                $.ajax({
                    data: {
                        kecamatan_id: kecamatan_id,
                        nama_barang: $("#cari-barang").val()
                    },
                    url: "/highlightBarang",
                    success: function (response2) {
                        $("#refresh-barang").html(response2)
                    }
                });
            }
        });
    })

    function refreshBarang(id) {
        // RENDER NAMA BARANG
        $.ajax({
            data: {
                nama_barang: "",
            },
            url: "/cariBarang",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $.ajax({
                    data: {
                        kecamatan_id: id,
                        nama_barang: ""
                    },
                    url: "/highlightBarang",
                    success: function (response2) {
                        $("#refresh-barang").html(response2)
                    }
                });
            }
        });
    }
    // CROPPER
    $("body").on("change", "#gambar", function (e) {
        let files = e.target.files;
        let done = function (url) {
            image.src = url;
            $("#modal-cropper").modal("show");
        }

        if (files && files.length > 0) {
            file = files[0];

            if (URL) {
                done(URL.createObjectURL(file));
            } else if (FileReader) {
                reader = new FileReader();
                reader.onload = function (e) {
                    done(reader.result);
                }
                reader.readAsDataURL(file)
            }
        }

    })

    $("#modal-cropper").on('shown.bs.modal', function () {
        cropper = new Cropper(image, {
            aspectRatio: 1 / 1,
            preview: '.preview'
        })
    }).on('hidden.bs.modal', function () {
        cropper.destroy();
        cropper = null;
    })

    $(".crop_photo").on('click', function () {
        canvas = cropper.getCroppedCanvas({
            width: 900,
            height: 900,
        })

        canvas.toBlob(function (blob) {
            const imageBase = document.querySelector("input[name='upload_gambar']");
            const imgPre = document.querySelector("#image-gambar");
            const oFReader = new FileReader();
            oFReader.readAsDataURL(blob);
            oFReader.onload = function (oFREvent) {
                imgPre.src = oFREvent.target.result;
                imageBase.value = oFREvent.target.result;
            }
        })

        $("#modal-cropper").modal("hide")
    })
});

// VANILA-----------------------------------------------
function hanyaNomor(evt) {
    // Hanya izinkan input karakter numerik
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
    }
}

function resetInput() {
    // Reset input jika terdeteksi karakter non-numerik atau non-koma
    var nomorInput = document.getElementById('nomorInput');
    nomorInput.value = nomorInput.value.replace(/[^0-9,]/g, ''); // Hanya mempertahankan nomor dan koma
}

// //MENGETAHUI APAKAH DEVICE WINDOWS ATAU BUKAN-----------------------------------------------------------------
// let operatingSystem = navigator.platform;

// // Memeriksa apakah sistem operasinya Windows
// if (operatingSystem.indexOf('Win') !== -1) {
//     let gambar = document.querySelector('#rules-gambar');
//     gambar.innerHTML = `<i class="text-danger">Untuk Upload Gambar Silahkan Gunakan Device Handphone!</i>
//     <input type="hidden" name="gambar" id="gambar">`;
// }
// else if (operatingSystem.indexOf('Mac') !== -1) {
//     let gambar = document.querySelector('#rules-gambar');
//     gambar.innerHTML = `<i class="text-danger">Untuk Upload Gambar Silahkan Gunakan Device Handphone!</i>
//     <input type="hidden" name="gambar" id="gambar">
//     `;
// }
// //AKHIR MENGETAHUI APAKAH DEVICE WINDOWS ATAU BUKAN-------------------------------------------------------------
function previewImage() {
    const image = document.querySelector("#gambar");
    const imageBase = document.querySelector("input[name='upload_gambar']");
    const imgPre = document.querySelector("#image-gambar");

    const oFReader = new FileReader();
    oFReader.readAsDataURL(image.files[0]);
    oFReader.onload = function (oFREvent) {
        imgPre.src = oFREvent.target.result;
        imageBase.value = oFREvent.target.result;
    };
}