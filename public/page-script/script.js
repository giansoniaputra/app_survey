// JQUERY------------------------------------------------------
$(document).ready(function () {
    // KETIKA KECAMATAN DIPILIH
    $("#kecamatan").on("change", function () {
        $("input[name='kecamatan']").val($(this).val());
    })
    //PENCARIAN KOMODITAS
    $("#cari-komoditas").on("keyup", function () {
        // RENDER KOMODITAS BARANG
        $.ajax({
            data: {
                komoditas: $(this).val(),
            },
            url: "/cariKomoditas",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                // console.log(response.data);
                let i = 1;
                let render = response.data.map((a) => {
                    return `
                    <button class="btn btn-success btn-sm pilih-komoditas" type="button" data-id="${a.id}">${i++}. ${a.komoditas}</button>
                    `
                })
                $(".render_komoditas").html(render)
            }
        });
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
            let kecamatan_id = $("input[name='kecamatan']").val();
            let komoditas_id = $(this).attr("data-id");
            $('input[name="komoditas_id"]').val(komoditas_id);
            $("input[name='komoditas']").val(komoditas_id);
            $.ajax({
                data: {
                    kecamatan_id: kecamatan_id
                },
                url: "/getWilayahId",
                type: "GET",
                dataType: 'json',
                success: function (response) {
                    $("input[name='wilayah_id']").val(response.wilayah_id);
                    refreshBarang($("input[name='wilayah_id']").val(), komoditas_id)
                    $("#card-pertama").addClass("d-none");
                    $("#card-kedua").removeClass("d-none");
                    $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-1"><i class="ri-arrow-left-line"></i>Kembali</button>`)
                }
            });
        }
    })

    // KETIKA TOMBOL SIMPAN PADA NAMA TOKO dan UPLOAD GAMBAR DI TEKAN
    $("#simpan-data-toko").on("click", function () {
        $("#spinner").html(loader)
        $(this).attr("disabled", "true");
        if ($("#gambar").val() == "" || $("#nama_toko").val() == "") {
            $("#spinner").html("")
            $(this).removeAttr("disabled");
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
            // let formdata = $('form[id="form-identitas"]').serializeArray();
            // let data = {}
            // $(formdata).each(function (index, obj) {
            //     data[obj.name] = obj.value;
            // });
            // console.log(formdata);
            //LONGITUDE dan LATITUDE
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;
                    let formData = $('form[id="form-identitas"]').serialize();
                    formData += '&lat=' + latitude + '&long=' + longitude;
                    $.ajax({
                        data: formData,
                        url: "/simpanHeadSurvey",
                        type: "POST",
                        dataType: 'json',
                        success: function (response) {
                            $("#simpan-data-toko").removeAttr("disabled");
                            $("#spinner").html("")
                            $("input[name='survey_id']").val(response.current_id);
                            $("#card-kedua").addClass("d-none");
                            $("#card-kedua-setengah").removeClass("d-none");
                            $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-2"><i class="ri-arrow-left-line" id="back"></i>Kembali</button>`)
                        }
                    });
                });
            } else {
                console.log("Lokasi anda tidak aktif atau browser anda tidak support fitur lokasi!");
            }
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
        $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-3"><i class="ri-arrow-left-line"></i>Kembali</button>`)
    })

    // KETIKA BARANG DIPILIH (YANG DI HIGHLIGHT)
    $("#barang").on("click", ".pilih-barang-update", function () {
        let wilayah_id = $("input[name='wilayah_id']").val();
        $.ajax({
            data: {
                id: $(this).attr("data-id"),
                wilayah_id: wilayah_id
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
        $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-3"><i class="ri-arrow-left-line"></i>Kembali</button>`)
    })

    // MEMASUKAN DATA HARGA BARU
    $("#btn-action").on("click", "#simpan", function (event) {
        $("#spinner").html(loader)
        $(this).attr("disabled", "true");
        if ($("#nama_barang").val() == "" || $("#harga_barang_lama").val() == "" || $("#harga_barang_baru").val() == "") {
            $("#spinner").html("")
            $(this).removeAttr("disabled");
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
                    $("#btn-action #simpan").removeAttr("disabled");
                    let wilayah_id = $("input[name='wilayah_id']").val();
                    let komoditas_id = $("input[name='komoditas_id']").val()
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
                                    wilayah_id: wilayah_id,
                                    nama_barang: "",
                                    komoditas_id: komoditas_id
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
                    // $("input[name='upload_gambar']").val("");
                    // $("input[name='nama_toko']").val("");
                    // $("input[name='survey_id']").val("");
                    $("input[name='barang']").val("");
                    $("input[name='nama_barang']").val("");
                    $("input[name='harga_barang_lama']").val("");
                    $("input[name='harga_barang_baru']").val("");
                    // $("#gambar").val("");
                    // $("#gambar").next(".custom-file-label").html("Pilih gambar");
                    // $("#image-gambar").attr("src", "/upload.png");
                    $("#card-kedua-setengah").removeClass("d-none");
                    $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-2"><i class="ri-arrow-left-line"></i>Kembali</button>`)
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
        $(this).attr("disabled", "true");
        if ($("#nama_barang").val() == "" || $("#harga_barang_lama").val() == "" || $("#harga_barang_baru").val() == "") {
            $(this).removeAttr("disabled");
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
                    $("#btn-action #update").removeAttr("disabled");
                    $("#spinner").html("")
                    let wilayah_id = $("input[name='wilayah_id']").val();
                    // RENDER NAMA BARANG
                    let komoditas_id = $("input[name='komoditas_id']").val()
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
                                    wilayah_id: wilayah_id,
                                    nama_barang: "",
                                    komoditas_id: komoditas_id
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
                    // $("input[name='upload_gambar']").val("");
                    // $("input[name='nama_toko']").val("");
                    // $("input[name='survey_id']").val("");
                    $("input[name='barang']").val("");
                    $("input[name='nama_barang']").val("");
                    $("input[name='harga_barang_lama']").val("");
                    $("input[name='harga_barang_baru']").val("");
                    // $("#gambar").val("");
                    // $("#gambar").next(".custom-file-label").html("Pilih gambar");
                    // $("#image-gambar").attr("src", "/upload.png");
                    $("#card-kedua-setengah").removeClass("d-none");
                    $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-4"><i class="ri-arrow-left-line"></i>Kembali</button>`)
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
        let wilayah_id = $("input[name='wilayah_id']").val();
        let komoditas_id = $("input[name='komoditas_id']").val()
        $.ajax({
            data: { nama_barang: $(this).val() },
            url: "/cariBarang",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                // RENDER NAMA BARANG
                $.ajax({
                    data: {
                        wilayah_id: wilayah_id,
                        nama_barang: $("#cari-barang").val(),
                        komoditas_id: komoditas_id
                    },
                    url: "/highlightBarang",
                    success: function (response2) {
                        $("#refresh-barang").html(response2)
                    }
                });
            }
        });
    })

    function refreshBarang(id, komoditas_id) {
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
                        wilayah_id: id,
                        nama_barang: "",
                        komoditas_id: komoditas_id
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
    // $("body").on("change", "#gambar", function (e) {
    //     let files = e.target.files;

    //     if (files && files.length > 0) {
    //         file = files[0];

    //         if (URL) {
    //             // Langsung panggil fungsi crop
    //             cropImage(URL.createObjectURL(file));
    //         } else if (FileReader) {
    //             reader = new FileReader();
    //             reader.onload = function (e) {
    //                 // Langsung panggil fungsi crop
    //                 cropImage(reader.result);
    //             }
    //             reader.readAsDataURL(file);
    //         }
    //     }
    // });

    // // Fungsi untuk melakukan cropping langsung
    // function cropImage(url) {
    //     let image = new Image();
    //     image.src = url;

    //     image.onload = function () {
    //         canvas = cropper.getCroppedCanvas({
    //             width: 500,
    //             height: 500,
    //         })

    //         canvas.toBlob(function (blob) {
    //             const imageBase = document.querySelector("input[name='upload_gambar']");
    //             const imgPre = document.querySelector("#image-gambar");
    //             const oFReader = new FileReader();
    //             oFReader.readAsDataURL(blob);
    //             oFReader.onload = function (oFREvent) {
    //                 imgPre.src = oFREvent.target.result;
    //                 imageBase.value = oFREvent.target.result;
    //             }
    //         })
    //     };
    // }
    $("body").on("change", "#gambar", function (e) {
        let files = e.target.files;
        let done = function (url) {
            image.src = url;
            // $("#modal-cropper").modal("show");
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
        cropper = new Cropper(image, {
            aspectRatio: 2 / 3,
            preview: '.preview'
        })
        $("#spinner").html(loader)
        setTimeout(() => {
            canvas = cropper.getCroppedCanvas({
                width: 500,
                height: 500,
            })

            canvas.toBlob(function (blob) {
                const imageBase = document.querySelector("input[name='upload_gambar']");
                const imgPre = document.querySelector("#image-gambar");
                const oFReader = new FileReader();
                oFReader.readAsDataURL(blob);
                oFReader.onload = function (oFREvent) {
                    $("#spinner").html("")
                    imgPre.src = oFREvent.target.result;
                    imageBase.value = oFREvent.target.result;
                }
            })
        }, 1000)


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
            width: 500,
            height: 500,
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
    // NAVIGASI
    $("#btn-back").on("click", ".back-1", function () {
        $(this).remove();
        $('input[name="komoditas_id"]').val("")
        $("#card-pertama").removeClass("d-none");
        $("#card-kedua").addClass("d-none");
    })
    $("#btn-back").on("click", ".back-2", function () {
        $("#spinner").html(loader);
        $.ajax({
            data: { id: $("input[name='survey_id']").val() },
            url: "/resetHeadSurvey",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                $("#spinner").html("");
            }
        });
        $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-1"><i class="ri-arrow-left-line"></i>Kembali</button>`)
        $("#card-kedua").removeClass("d-none");
        $("#card-kedua-setengah").addClass("d-none");
    })
    $("#btn-back").on("click", ".back-3", function () {
        $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-2"><i class="ri-arrow-left-line"></i>Kembali</button>`)
        $("#card-kedua-setengah").removeClass("d-none");
        $("#card-ketiga").addClass("d-none");
    })
    $("#btn-back").on("click", ".back-4", function () {
        $("#btn-back").html(`<button type="button" class="btn btn-info rounded-pill mx-3 back-1"><i class="ri-arrow-left-line"></i>Kembali</button>`)
        $("#card-kedua").removeClass("d-none");
        $("#card-kedua-setengah").addClass("d-none");
    })
});
//AKHIR JQUERY------------------------------------------

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