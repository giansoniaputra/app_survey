<!DOCTYPE html>
<html lang="en" data-layout="topnav" data-topbar-color="dark" data-menu-color="light">

<head>
    <meta charset="utf-8" />
    <title>Survei Barang</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="A fully responsive admin theme which can be used to build CRM, CMS,ERP etc." name="description" />
    <meta content="Techzaa" name="author" />

    <!-- App favicon -->
    <link rel="shortcut icon" href="/assets/images/favicon.ico">

    <!-- Select2 css -->
    <link href="/assets/vendor/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

    <!-- Daterangepicker css -->
    <link rel="stylesheet" href="/assets/vendor/daterangepicker/daterangepicker.css">

    <!-- Vector Map css -->
    <link rel="stylesheet" href="/assets/vendor/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.css">

    <!-- Theme Config Js -->
    <script src="/assets/js/config.js"></script>

    <!-- App css -->
    <link href="/assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />

    <!-- Icons css -->
    <link href="/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <script src="/jquery-3.7.1.min.js"></script>
    {{-- SweetAlert --}}
    <link rel="stylesheet" href="/page-css/sweetalert2.min.css">
    <script src="/page-script/sweetalert2.all.min.js"></script>
    {{-- CROPPER --}}
    <link rel="stylesheet" href="/page-css/cropper.min.css">
    <script src="/page-script/cropper.min.js"></script>
    {{-- LOADER --}}
    <style>
        .spinner {
            width: 56px;
            height: 56px;
            display: grid;
            border: 4.5px solid #0000;
            border-radius: 50%;
            border-color: #ffff #0000;
            animation: spinner-e04l1k 1s infinite linear;
        }

        .spinner::before,
        .spinner::after {
            content: "";
            grid-area: 1/1;
            margin: 2.2px;
            border: inherit;
            border-radius: 50%;
        }

        .spinner::before {
            border-color: #474bff #0000;
            animation: inherit;
            animation-duration: 0.5s;
            animation-direction: reverse;
        }

        .spinner::after {
            margin: 8.9px;
        }

        @keyframes spinner-e04l1k {
            100% {
                transform: rotate(1turn);
            }
        }

        .card-spinner {
            position: fixed;
            top: 50vh;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 100000;
            padding: 75px 150px;
            background-color: rgba(0, 0, 0, 0.3);
        }

    </style>
    <script>
        const loader = `
            <div class="card d-flex justify-conten-center align-items-center card-spinner">
                <div class="spinner" style="position:relative;z-index: 101;"></div>
            </div>`

    </script>
</head>

<body>
    <!-- Begin page -->
    <div class="wrapper">

        <!-- ========== Topbar Start ========== -->
        <div class="navbar-custom">
            <div class="topbar container-fluid">
                <div class="d-flex align-items-center gap-1">

                    <!-- Topbar Brand Logo -->
                    <div class="logo-topbar">
                        <!-- Logo light -->
                        <a href="index.html" class="logo-light">
                            <span class="logo-lg">
                                <img src="/assets/images/logo.png" alt="logo">
                            </span>
                            <span class="logo-sm">
                                <img src="/assets/images/logo-sm.png" alt="small logo">
                            </span>
                        </a>

                        <!-- Logo Dark -->
                        <a href="index.html" class="logo-dark">
                            <span class="logo-lg">
                                <img src="/assets/images/logo-dark.png" alt="dark logo">
                            </span>
                            <span class="logo-sm">
                                <img src="/assets/images/logo-sm.png" alt="small logo">
                            </span>
                        </a>
                    </div>

                    <!-- Sidebar Menu Toggle Button -->
                    <button class="button-toggle-menu">
                        <i class="ri-menu-line"></i>
                    </button>

                    <!-- Horizontal Menu Toggle Button -->
                    <button class="navbar-toggle" data-bs-toggle="collapse" data-bs-target="#topnav-menu-content">
                        <div class="lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>

                <ul class="topbar-menu d-flex align-items-center gap-3">
                    <li class="dropdown">
                        <a class="nav-link dropdown-toggle arrow-none nav-user" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <span class="account-user-avatar">
                                <img src="/assets/images/users/avatar-1.jpg" alt="user-image" width="32" class="rounded-circle">
                            </span>
                            <span class="d-lg-block d-none">
                                <h5 class="my-0 fw-normal">Thomson <i class="ri-arrow-down-s-line d-none d-sm-inline-block align-middle"></i></h5>
                            </span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end dropdown-menu-animated profile-dropdown">
                            <!-- item-->
                            <a href="/logout" class="dropdown-item">
                                <i class="ri-logout-box-line fs-18 align-middle me-1"></i>
                                <span>Logout</span>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- ========== Topbar End ========== -->
        @include('layouts.horizontal-bar')
        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== -->

        <div class="content-page">
            <div class="content">
                <div id="spinner">
                </div>
                <!-- Start Content-->
                <div class="container-fluid">
                    @yield('container')
                </div>
            </div>
        </div>
    </div>
    <!-- END wrapper -->
    <!-- Vendor js -->
    <script src="/assets/js/vendor.min.js"></script>

    {{-- Simple Money Format --}}
    <script src="/simple.money.format.js"></script>
    <script src="/simple.money.format.init.js"></script>

    <script src="/select2.min.js"></script>
    <script>
        $(document).ready(function() {
            $(".select2").select2();
        })

    </script>

    <!-- Daterangepicker js -->
    <script src="/assets/vendor/daterangepicker/moment.min.js"></script>
    <script src="/assets/vendor/daterangepicker/daterangepicker.js"></script>

    <!-- Apex Charts js -->
    <script src="/assets/vendor/apexcharts/apexcharts.min.js"></script>

    <!-- Vector Map js -->
    <script src="/assets/vendor/admin-resources/jquery.vectormap/jquery-jvectormap-1.2.2.min.js"></script>
    <script src="/assets/vendor/admin-resources/jquery.vectormap/maps/jquery-jvectormap-world-mill-en.js"></script>

    <!-- Dashboard App js -->
    <script src="/assets/js/pages/dashboard.js"></script>


    <!-- App js -->
    <script src="/assets/js/app.min.js"></script>

</body>
</html>
