<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
            'images' => session('images'),
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
    public function upload(Request $request)
    {

        // Create validation rules for each image.
        $images = $request->file('images');
        $rules = [];
        foreach ($images as $key => $value) {
            $rules['images.' . $key] = 'required|image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        // Validate the images.
        $validator = Validator::make($request->all(), $rules);

        // If an image's rule failed, remove it from $images.
        if ($validator->fails()) {
            $failed = $validator->failed();
            foreach ($failed as $rule) {

                // Get the image's index from the rule's key.
                $imageKey = intval(str_replace('images.', '', key($failed)));
                array_splice($images, $imageKey, 1);
            }
        }

        // TODO if no images passed, return.

        // TODO create images directory if it doesn't exist.

        // Store the validated files.
        $uploadPath = storage_path('app/images');
        $fileNames = [];
        foreach ($images as $image) {
            $fileName = Str::uuid() . '.' . $image->extension();
            $image->move($uploadPath, $fileName);
            $fileNames[] = $fileName;
        }

        // Add the filenames to the session for later retrievel.
        $fileNames = implode(',', $fileNames);
        if (session('images')) {
            $fileNames = session('images') . ',' . $fileNames;
        }

        session(['images' => $fileNames]);

        // TODO Return the validated images.

        return response()->json(['success' => 'success'], 200);
    }
}
