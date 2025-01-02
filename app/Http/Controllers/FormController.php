<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
//use Stevebauman\Purify\Facades\Purify;
use Illuminate\Support\Facades\Log;

class FormController extends Controller
{
    public function show()
    {
        return view('form');
    }

    public function save(Request $request)
    {
        // Validate.
        return response()->json(['success' => 'success'], 200);
    }
}
