<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('placeholder');
});

Route::get('/wip', '\App\Http\Controllers\FormController@show');
Route::post('/form', '\App\Http\Controllers\FormController@save');
Route::post('/images', '\App\Http\Controllers\FormController@upload');
