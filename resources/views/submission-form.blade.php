<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel=stylesheet href="/css/style.css">
        <title>VR Slideshow</title>
    </head>
    <body>
        <main>
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h1 class="title page-title"><img src="/img/vrslideshow_logo.png" alt="VR Slideshow"></h1>
                        <p>Welcome to the VR Slideshow creator! Just enter your title, beginning and ending text, and upload your images below. Check your email in 3 to 5 days for your VR Slideshow download!</p>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content">
                        <h2>Build Your Slideshow</h2>
                        <div class="flex select-slideshow" role="radiogroup" aria-label="Slideshow type">
                            <button id="select-basic" role="radio" aria-checked="true">
                                <span class="type">Basic</span>
                                <span class="price"><span class="dollar">$</span>49</span>
                                <span>10 images</span>
                            </button>
                            <button id="select-premium" role="radio" aria-checked="false">
                                <span class="type">Premium</span>
                                <span class="price"><span class="dollar">$</span>99</span>
                                <span>20 images</span>
                            </button>
                        </div>
                        <label for="slideshow-title">Title</label>
                        <input name="slideshow-title" id="slideshow-title" type="text" placeholder="My Slideshow">
                        <label for="slideshow-opening-text">Opening Text</label>
                        <textarea name="slideshow-opening-text" id="slideshow-opening-text" placeholder="My slideshow's opening text"></textarea>
                        <label for="slideshow-images">Images<span class="required">(required)</span></label>
                        <label for="slideshow-closing-text">Closing Text</label>
                        <textarea name="slideshow-closing-text" id="slideshow-closing-text" placeholder="My slideshow's closing text"></textarea>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Contact Info</h2>
                        <fieldset class="flex">
                            <div><legend>Contact me by:</legend></div>
                            <div class="flex radio">
                                <input type="radio" id="contact-email" name="contact" value="email">
                                <label for="contact-email" class="small">Email</label>
                            </div>
                            <div class="flex radio">
                                <input type="radio" id="contact-text" name="contact" value="text" />
                                <label for="contact-text" class="small">Text</label>
                            </div>
                        </fieldset>
                        <label for="email">Email<span class="required">(required)</span></label>
                        <input required name="email" id="email" type="email" placeholder="me@example.com">
                        <label for="email" style="display:none;">Phone:</label>
                        <input name="phone" id="phone" type="tel" placeholder="123-456-7890" style="display:none;">
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
            <div class="section">
                <div class="inner">
                    <div class="content narrow">
                        <h2>Payment</h2>
                        <h2 class="tos">Terms and Conditions<span class="required">(required)</span></h2>
                        <div class="flex checkbox">
                            <input required name="copyright" id="copyright" type="checkbox">
                            <label for="copyright" class="small flex">I own the copyright to my slideshow images, or am otherwise licensed to use them.</label>
                        </div>
                        <div class="flex checkbox">
                            <input required name="tos" id="tos" type="checkbox">
                            <label for="tos" class="small flex">I certify that my slideshow does not contain any violent or pornographic images. I understand that if I submit any violent or pornographic images, the slideshow will not be created, and I will not receive a refund.</label>
                        </div>
                        <button type="submit">Submit</button>
                    </div><!-- .content -->
                </div><!-- .inner -->
            </div><!-- .section -->
        </main>
    </body>
</html>
