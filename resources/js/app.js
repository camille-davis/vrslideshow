import $ from 'jquery';

(function(){

  // If any input is updated, ask user to confirm if navigating away from age.
  $('input, textarea').one('input', () => {
    window.onbeforeunload = () => {
      return true;
    };
  });

  // Add CSRF token to all requests.
  $.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

  /**
   * Image thumbnail functionality
   */

  // Updates image validation warnings.
  const updateImageValidation = () => {

    // Remove image validation warnings in thumbnail area and under Submit button.
    $('.image-validation-error').remove();

    // Get number of images remaining.
    const premium = $('body').hasClass('premium');
    let imagesRemaining;
    if (premium) {
      imagesRemaining = 20;
    } else {
      imagesRemaining = 10;
    }
    imagesRemaining -= $('#thumb-preview .thumb').length;

    // If number is negative, display error and set to 0.
    if (imagesRemaining < 0) {
      const imagesToRemove = imagesRemaining * -1;
      let errorText = '<p>';
      if ((imagesToRemove === 1) && (premium)) {
        errorText += 'You have too many images. Please remove one image.'
      } else if (imagesToRemove === 1) {
        errorText += 'You have too many images.</p><p>Please remove one image, or switch to Premium.'
      } else if (premium) {
        errorText += `You have too many images. Please remove ${imagesToRemove} images.`
      } else {
        errorText += `You have too many images.</p><p>Please remove ${imagesToRemove} images, or switch to Premium.`
      }
      errorText += '</p>';

      $('#thumb-preview').prepend(`<div role="alert" class="error image-validation-error"><img src="/img/warning.png" alt="Warning"><div>${errorText}</div></div>`);
      imagesRemaining = 0;
    }

    // Update 'images remaining' label.
    if (imagesRemaining === 1) {
      $('#images-remaining').text('1 image remaining');
    } else {
      $('#images-remaining').text(`${imagesRemaining} images remaining`);
    }

    // Validate combined file size.
    let size = 0;
    for (let i = 0; i < $('#add-images')[0].files.length; i++) {
      size += $('#add-images')[0].files[i].size;
      let maxBytes, maxText;
      if ($('body').hasClass('premium')) {
        // maxBytes = 20971520; // 20MB for testing.
        maxBytes = 2147483648;
        maxText = '2GB';
      } else {
        // maxBytes = 10485760; // 10MB for testing.
        maxBytes = 1073741824;
        maxText = '1GB';
      }
      if (size > maxBytes) {
        $('#thumb-preview').prepend($(`<div role="alert" class="error image-validation-error"><img src="/img/warning.png" alt="Warning"><div>Combined size of images should not exceed <span class="max-filesize">${maxText}</span>.</div></div>`));
        break;
      }
    }
  };

  const deleteImage = (e) => {
    e.preventDefault();
    const thumb = e.target.closest('.thumb')
    const deletedIndex = $(thumb).index();

    // Remove file from #add-images input data.
    const dataTransfer = new DataTransfer();
    const files = $('#add-images')[0].files;
    for (let i = 0; i < deletedIndex; i++) {
      dataTransfer.items.add(files[i]);
    }
    for (let i = deletedIndex + 1; i < files.length; i++) {
      dataTransfer.items.add(files[i]);
    }
    $('#add-images')[0].files = dataTransfer.files;

    // Update UI.
    thumb.remove();
    updateImageValidation();
  };

  // Globals for drag functionality.
  let selectedThumb, startPos;
  const resetDrag = () => {
    selectedThumb = startPos = null;
  };

  // Remove delay on dragend.
  $(document).on('dragover', function (e) {
    e.preventDefault();
  });

  // Update order of input.files based on start and end position of a given image.
  const updateImageOrder = (startPos, endPos) => {
    const dataTransfer = new DataTransfer();
    const files = $('#add-images')[0].files;

    if (endPos < startPos) {
      for (let i = 0; i < endPos; i++) {
        dataTransfer.items.add(files[i]);
      }
      dataTransfer.items.add(files[startPos]);
      for (let i = endPos; i < startPos; i++) {
        dataTransfer.items.add(files[i]);
      }
      for (let i = startPos + 1; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
    } else {
      for (let i = 0; i < startPos; i++) {
        dataTransfer.items.add(files[i]);
      }
      for (let i = startPos + 1; i <= endPos; i++) {
        dataTransfer.items.add(files[i]);
      }
      dataTransfer.items.add(files[startPos]);
      for (let i = endPos + 1; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
    }

    $('#add-images')[0].files = dataTransfer.files;
  };

  // Displays images from FileList and adds delete/move buttons.
  const displayImages = (files) => {

    // Convert files to base64 string, using promise to conserve upload order.
    const promiseArray = [];
    Array.from(files).forEach((file) => {
      let reader = new FileReader();
      promiseArray.push(new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }));
    });

    // Display the new images and add 'delete' and 'move' functionality.
    Promise.all(promiseArray).then((dataUrls) => {
      dataUrls.forEach((file) => {
        const thumb = $(`<div class="gallery-item thumb" draggable="true"><img src="${file}" draggable="false" /></div>`);

        // Add 'delete' functionality.
        const deleteButton = $('<button class="delete thumb-action"><img src="/img/x.png" alt="Delete image" draggable="false" /></button>');
        deleteButton.on('click', deleteImage);

        // Add 'move' functionality.
        const handIcon = $('<img src="/img/hand_open.png" alt="Move image" draggable="false" />');
        const moveButton = $('<button class="move thumb-action" aria-pressed="false"></button>').append(handIcon);
        moveButton.on('click', function() {

          // Toggle button on or off.
          if (moveButton.attr('aria-pressed') === 'true') {
              moveButton.removeAttr('aria-pressed');
              handIcon.attr('src', '/img/hand_open.png');
              return;
          }
          moveButton.attr('aria-pressed', 'true');
          handIcon.attr('src', '/img/hand_closed.png');
          moveButton.trigger('focus');
        });
        thumb.on('keydown', function(e) {
          if (e.key === 'Escape') {
            moveButton.removeAttr('aria-pressed');
            handIcon.attr('src', '/img/hand_open.png');
            return;
          }

          // Arrow key actions.
          const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
          if (moveButton.attr('aria-pressed') !== 'true' || !arrowKeys.includes(e.key)) {
            return;
          }
          e.preventDefault();
          const index = thumb.index();
          const thumbLength = $('#thumb-preview .thumb').length;
          let newIndex, interval;
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            interval = 1;
          } else if (window.matchMedia('(min-width: 768px)').matches) {
            interval = 4;
          } else {
            interval = 2;
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            newIndex = index - interval;
            if (newIndex >= 0) {
              thumb.insertBefore($('#thumb-preview .thumb')[newIndex])
              updateImageOrder(index, newIndex);
              moveButton.trigger('focus');
            }
            return;
          }
          newIndex = index + interval;
          if (newIndex < thumbLength) {
            thumb.insertAfter($('#thumb-preview .thumb')[newIndex])
            updateImageOrder(index, newIndex);
            moveButton.trigger('focus');
          }
        });
        moveButton.on('blur', function() {
          moveButton.removeAttr('aria-pressed');
          handIcon.attr('src', '/img/hand_open.png');
        });
        thumb.on('dragstart', function(e) {
          moveButton.attr('aria-pressed', 'true');
          handIcon.attr('src', '/img/hand_closed.png');

          // Set globals.
          selectedThumb = $(this);
          startPos = selectedThumb.index();
        })
        thumb.on('dragend', function() {

          // Save updated order to input.files
          const endPos = $(this).index();
          if (startPos !== endPos) {
            updateImageOrder(startPos, endPos);
          }

          // Reset UI and globals.
          moveButton.removeAttr('aria-pressed');
          handIcon.attr('src', '/img/hand_open.png');
          resetDrag();
        });
        thumb.on('dragover', function (e) {
          if (!selectedThumb) {
            return;
          }
          if ($(this).index() < selectedThumb.index()) {
            selectedThumb.insertBefore(this);
            return;
          }
          selectedThumb.insertAfter(this);
        });

        thumb.append(moveButton).append(deleteButton);
        thumb.insertBefore($('.gallery-item:last-child'));
      });

      // Update image validation warnings.
      updateImageValidation();
    });
  };

  $('#add-images').on('change', function(e) {
    e.preventDefault();

    // Display new images.
    displayImages(this.files);

    // Save old and new files to input.files
    const dataTransfer = new DataTransfer();
    Array.from(this.oldFiles).forEach((file) => {
      dataTransfer.items.add(file);
    })
    Array.from(this.files).forEach((file) => {
      dataTransfer.items.add(file);
    })
    this.files = dataTransfer.files;
  });

  // Save previously uploaded files to prepend to input.files on change.
  $('#add-images').on('click', function (e) {
    this.oldFiles = this.files;
  });

  // Add keyboard functionality to 'add images' input (which is actually a label).
  $('label[for="add-images"]').on('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('#add-images').trigger('click');
    }
  });

  // If images were saved to session automatically (on Firefox), display them.
  if ($('#add-images')[0].files.length) {
    displayImages($('#add-images')[0].files);
  }

  /**
   * Basic vs Premium Functionality
   */

  $('#select-premium').on('click', function() {
    $('body').addClass('premium');
    $('.max-filesize').text('2GB');
    updateImageValidation();
  });
  $('#select-basic').on('click', function() {
    $('body').removeClass('premium');
    $('.max-filesize').text('1GB');
    updateImageValidation();
  });

  // If no slideshow type was selected, default to Basic.
  if ($('input[name="slideshow-type"]:checked').length === 0) {
    $('#select-basic').prop('checked', 'true');
  }

  // If page was loaded with 'Premium' selected, run validation and update style.
  if ($('#select-premium:checked').length > 0) {
    $('#select-premium').trigger('click');
  }

  /**
   * Additional validation (emails and required inputs)
   */

  // Validates email input.
  const validateEmail = () => {
    $('.email-error').remove();
    const email = $('#email').val();
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email !== '' && !emailRegex.test(email)) {
      $(`<div role="alert" class="error email-error"><img src="/img/warning.png" alt="Warning"><div>Email format is incorrect.</div></div>`).insertBefore($('#email'));
    }
  }
  $('#email').on('change', validateEmail);
  validateEmail();

  // If a required input is filled, remove error.
  $('[required]:not(#copyright):not(#tos)').on('change', function() {
    $(`#${this.id}-required-error`).remove();
    if ($('#required-errors p').length === 0) {
      $('#required-errors').remove();
    }
  })

  // If both TOS are checked, remove error.
  $('#tos,#copyright').on('change', function() {
    if ($('#tos:checked,#copyright:checked').length === 2) {
      $('#tos-error').remove();
    }
  });

  /**
   * Beta tester functionality.
   */

  // Treat pressing 'Enter' on Secret Code field like submitting.
  $('#secret-code').on('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      $('#submit').trigger('click');
    }
  });

  // On submit, validate then send data.
  $('#submit').on('click', function() {
    $('#validation-on-submit').empty();

    // Validate required inputs
    const required = $('[required]:not(#copyright):not(#tos)');
    const requiredErrors = [];
    required.each(function () {
      if (this.value !== '') {
        return;
      }
      if (this.id === 'add-images') {
        requiredErrors.push('<p id="add-images-required-error">Images are required.</p>');
      } else {
        const label = $(`label[for="${this.id}"]`).text().replace('\*', '');
        requiredErrors.push(`<p id="${this.id}-required-error">${label} is required.</p>`);
      }
    })
    if (requiredErrors.length > 0) {
      const requiredText = requiredErrors.join('');
      $('#validation-on-submit').append($(`<div id="required-errors" role="alert" class="error"><img src="/img/warning.png" alt="Warning"><div>${requiredText}</div></div>`));
    }

    // Copy any existing validation warnings in page and insert above Submit button.
    $(':not(#validation-on-submit) > .error').each(function() {
      $('#validation-on-submit').append($(this).clone());
    });

    // Validate TOS are checked
    if ($('#tos:not(:checked),#copyright:not(:checked)').length > 0) {
      $('#validation-on-submit').append($(`<div id="tos-error" role="alert" class="error"><img src="/img/warning.png" alt="Warning"><div>Please agree to terms and conditions.</div></div>`));
    }

    // If there's any errors, abort.
    if ($('.error').length > 0) {
      return;
    }

    // Send request TODO
  });
})();
