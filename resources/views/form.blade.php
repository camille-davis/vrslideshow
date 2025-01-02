<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf_token" content="{{ csrf_token() }}">
        <title>VR Slideshow</title>
        @vite(['resources/css/app.css'])
    </head>
    <body>
        <main>
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h1 class="title page-title"><img src="/img/vrslideshow_logo_beta.png" alt="VR Slideshow Beta"></h1>
                        <p><em>Only available to registered beta testers.</em></p>
                        <p>Welcome to the VRslideshow creator! Just enter your title, beginning and ending text, and upload your images below. Check your email in 3 to 5 days for your VR Slideshow download!</p>
                        <p>Fields marked with an asterisk (*) are required.</p>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content">
                        <h2>Build Your VRslideshow</h2>
                        <fieldset class="slideshow-type fullwidth">
                            <legend class="visually-hidden">Select slideshow type</legend>
                            <div class="radio">
                                <label for="select-basic" class="small">
                                    <span class="type">Basic</span>
                                    <span class="price"><span class="dollar">$</span>49</span>
                                    <span>10 images</span>
                                </label>
                                <input type="radio" id="select-basic" name="slideshow_type" value="basic" />
                            </div>
                            <div class="radio">
                                <label for="select-premium" class="small">
                                    <span class="type">Premium</span>
                                    <span class="price"><span class="dollar">$</span>99</span>
                                    <span>20 images</span>
                                </label>
                                <input type="radio" id="select-premium" name="slideshow_type" value="premium" />
                            </div>
                        </fieldset>
                        <label for="slideshow-title"><span class="main-label">Title</span><span class="sub-label">Up to 50 characters.</span></label>
                        <input name="slideshow_title" id="slideshow-title" type="text" placeholder="My Slideshow" max="50" />
                        <label for="slideshow-opening-text"><span class="main-label">Opening Text</span><span class="sub-label">Up to 500 characters.</span></label>
                        <textarea name="slideshow_opening_text" id="slideshow-opening-text" placeholder="My slideshow's opening text"></textarea>
                        <label for="slideshow-images"><span class="main-label">Images<span class="required">*</span></span><span class="sub-label">Up to <span class="max-filesize">1GB</span> (combined size).<br />Allowed formats: JPEG, GIF, PNG, TIFF.</span></label>
                        <div id="thumb-preview">
                            <div class="gallery">
                                <div class="gallery-item">
                                    <label for="add-images" tabindex="0" class="small">
                                        <img src="/img/plus.png" alt="Add images" title="Add images"/>
                                        <div id="images-remaining">10 images remaining</div>
                                    </label>
                                    <input type='file' id="add-images" name="add_images" multiple required accept="image/png, image/jpeg, image/gif, image/tiff" />
                                </div>
                            </div>
                        </div>
                        <label for="slideshow-closing-text"><span class="main-label">Closing Text</span><span class="sub-label">Up to 500 characters.</span></label>
                        <textarea name="slideshow_closing_text" id="slideshow-closing-text" placeholder="My slideshow's closing text"></textarea>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Details</h2>
                        <label for="email"><span class="main-label">Email<span class="required">*</span></span></label>
                        <p>Your VRSlideshow will be sent to this email.</p>
                        <input required name="email" id="email" type="email" placeholder="me@example.com" />
                        <label><span class="main-label">Payment</span></label>
                        <p>Payment is disabled during beta testing.</p>
                        </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2 class="tos flex">Terms and Conditions<span class="required">*</span></h2>
                        <div class="flex checkbox">
                            <input required name="copyright" id="copyright" type="checkbox" />
                            <label for="copyright" class="small">I own the copyright to my slideshow images, or am licensed to use them. I have read and agree to the <a href="TODO">terms and conditions</a>.</label>
                        </div>
                        <div class="flex checkbox">
                            <input required name="tos" id="tos" type="checkbox" />
                            <label for="tos" class="small">I certify that my slideshow does not contain any violent or pornographic images. I understand that if I submit any violent or pornographic images, the slideshow will not be created, and I will not receive a refund.</label>
                        </div>
                        </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Generate VRSlideshow</h2>
                        <label for="secret-code"><span class="main-label">Secret Code<span class="required">*</span></span></label>
                        <input required name="secret_code" id="secret-code" type="text" placeholder="######" />
                        <div id="validation-on-submit" class="fullwidth"></div>
                        <button type="submit" id="submit">Generate!</button>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
        </main>
        @vite(['resources/js/app.js'])
    </body>
</html>
