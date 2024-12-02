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

        // Set default values.
        if (session('slideshow_type') === null) {
            session(['slideshow_type' => 'basic']);
        }

        $session_data = [
            'session_id' => session()->getId(),
            'slideshow_type' => session('slideshow_type'),
            'slideshow_title' => session('slideshow_title'),
            'slideshow_opening_text' => session('slideshow_opening_text'),
            'slideshow_closing_text' => session('slideshow_closing_text'),
            'email' => session('email'),
            'copyright' => session('copyright'),
            'tos' => session('tos'),
        ];

        return view('form', $session_data);
    }

    public function save(Request $request)
    {
        $key = $request->input('key');
        $allowed_keys = [
            'slideshow_type',
            'slideshow_title',
            'slideshow_opening_text',
            'slideshow_closing_text',
            'email',
            'copyright',
            'tos',
        ];
        if (!in_array($key, $allowed_keys)) {
            abort(403);
        }

        $value = $request->input('value');
        // TODO sanitize request.

        session([$key => $value]);

        return response()->json(['success' => 'success'], 200);
    }
}
