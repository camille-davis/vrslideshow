<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('placeholder');
});

Route::get('/wip', function () {
    return view('submission-form');
});
