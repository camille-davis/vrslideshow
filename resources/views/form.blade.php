<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>VR Slideshow</title>
        @vite(['resources/css/app.css'])
    </head>
    <body {{ $slideshow_type === 'premium' ? 'class="premium"' : '' }}>
        <main>
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h1 class="title page-title"><img src="/img/vrslideshow_logo.png" alt="VR Slideshow"></h1>
                        <p>Welcome to the VRslideshow creator! Just enter your title, beginning and ending text, and upload your images below. Check your email in 3 to 5 days for your VR Slideshow download!</p>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content">
                        <h2>Build Your VRslideshow</h2>
                        <fieldset class="slideshow-type">
                            <legend class="visually-hidden">Select slideshow type</legend>
                            <div class="radio">
                                <label for="select-basic" class="small">
                                    <span class="type">Basic</span>
                                    <span class="price"><span class="dollar">$</span>49</span>
                                    <span>10 images</span>
                                </label>
                                <input type="radio" id="select-basic" name="slideshow_type" value="basic" {{ $slideshow_type === 'basic' ? 'checked' : '' }} />
                            </div>
                            <div class="radio">
                                <label for="select-premium" class="small">
                                    <span class="type">Premium</span>
                                    <span class="price"><span class="dollar">$</span>99</span>
                                    <span>20 images</span>
                                </label>
                                <input type="radio" id="select-premium" name="slideshow_type" value="premium" {{ $slideshow_type === 'premium' ? 'checked' : '' }} />
                            </div>
                        </fieldset>
                        <label for="slideshow-title">Title</label>
                        <input name="slideshow_title" id="slideshow-title" type="text" placeholder="My Slideshow" value="{{ $slideshow_title }}"/>
                        <label for="slideshow-opening-text">Opening Text</label>
                        <textarea name="slideshow_opening_text" id="slideshow-opening-text" placeholder="My slideshow's opening text">{{ $slideshow_opening_text }}</textarea>
                        <label for="slideshow-images">Images<span class="required">(required)</span></label>
                        <div id="thumb-preview">
                            <div class="gallery">
                                <div class="gallery-item">
                                    <label for="add-images" tabindex="0" class="small">
                                        <img src="/img/plus.png" alt="Add images" title="Add images"/>
                                        <div id="images-remaining">10 images remaining</div>
                                    </label>
                                    <input type='file' id="add-images" name="add_images" multiple />
                                </div>
                            </div>
                        </div>
                        <label for="slideshow-closing-text">Closing Text</label>
                        <textarea name="slideshow_closing_text" id="slideshow-closing-text" placeholder="My slideshow's closing text">{{ $slideshow_closing_text }}</textarea>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Contact Info</h2>
                        <label for="email">Email<span class="required">(required)</span></label>
                        <input required name="email" id="email" type="email" placeholder="me@example.com" value="{{ $email }}"/>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Payment</h2>
                        <h2 class="tos">Terms and Conditions<span class="required">(required)</span></h2>
                        <div class="flex checkbox">
                            <input required name="copyright" id="copyright" type="checkbox" {{ $copyright === 'on' ? 'checked' : '' }}/>
                            <label for="copyright" class="small">I own the copyright to my slideshow images, or am licensed to use them. I have read and agree to the <a href="TODO">terms and conditions</a>.</label>
                        </div>
                        <div class="flex checkbox">
                            <input required name="tos" id="tos" type="checkbox" {{ $tos === 'on' ? 'checked' : '' }}/>
                            <label for="tos" class="small">I certify that my slideshow does not contain any violent or pornographic images. I understand that if I submit any violent or pornographic images, the slideshow will not be created, and I will not receive a refund.</label>
                        </div>
                        <button type="submit">Submit</button>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
        </main>
        @vite(['resources/js/app.js'])
    </body>
</html>
