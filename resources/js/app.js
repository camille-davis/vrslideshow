import $ from 'jquery';

(function(){

  /**
   * Image thumbnail functionality
   */
  //console.log(sessionStorage.getItem('files'));

  // Updates 'images remaining' label and warning.
  const updateImagesRemaining = () => {

    // Remove the warning.
    $('#too-many-images').remove();

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
      let errorText;
      if ((imagesToRemove === 1) && (premium)) {
        errorText = 'You have too many images. Please remove 1 image.'
      } else if (imagesToRemove === 1) {
        errorText = 'You have too many images.<br />Please remove 1 image, or switch to Premium.'
      } else if (premium) {
        errorText = `You have too many images. Please remove ${imagesToRemove} images.`
      } else {
        errorText = `You have too many images.<br />Please remove ${imagesToRemove} images, or switch to Premium.`
      }

      $('#thumb-preview').prepend(`<p role="alert" class="error" id="too-many-images"><img src="/img/warning.png" alt="Warning">${errorText}</p>`);
      imagesRemaining = 0;
    }

    // Update 'images remaining' label.
    if (imagesRemaining === 1) {
      $('#images-remaining').text('1 image remaining');
    } else {
      $('#images-remaining').text(`${imagesRemaining} images remaining`);
    }
  }

  const deleteImage = (e) => {
    e.preventDefault();
    const thumb = e.target.closest('.thumb')
    const deletedIndex = $(thumb).index();

    // Remove file from input.files
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
    updateImagesRemaining();
  }

  // Globals for drag functionality. I wish I could use e.dataTransfer instead
  // but it would need to be updated in dragover handler which isn't allowed.
  let selectedThumb, startPos;
  const resetDrag = () => {
    selectedThumb = startPos = null;
  }

  // Remove delay on dragend.
  $(document).on('dragover', function (e) {
    e.preventDefault();
  })

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
  }

  const displayImages = (fileData) => {
    fileData.forEach((file) => {
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

    // Update 'images remaining' label.
    updateImagesRemaining();
  }

  $('#add-images').on('change', function(e) {
    e.preventDefault()

    // Get new images as array of base64 strings.
    console.log(this.files[0]);
    //displayImages(this.files);
    return
    const promiseArray = [];
    for (var i = 0; i < this.files.length; i++) {
      let reader = new FileReader();
      promiseArray.push(new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(this.files[i]);
      }));
    }

    // Display new images and append them to session data.
    Promise.all(promiseArray).then((fileData) => {
      displayImages(fileData);

      let files = fileData.join("_");
      let oldFiles = sessionStorage.getItem('files');
      if (oldFiles !== null) {
        files = oldFiles + "_" + files;
      }
      sessionStorage.setItem('files', files);
    });
  });

  // Add keyboard functionality to 'add images' input (which is actually a label).
  $('label[for="add-images"]').on('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      $('#add-images').trigger('click');
    }
  })

  /**
   * Basic vs Premium
   */

  $('#select-premium').on('click', function() {
    $('body').addClass('premium');
    updateImagesRemaining();
  });
  $('#select-basic').on('click', function() {
    $('body').removeClass('premium');
    updateImagesRemaining();
  });

  /**
   * Save and get input data from session.
   */

  $('input[type="checkbox"]').each(function() {
    if (sessionStorage.getItem(this.name) === 'true')
      $(`input[name="${this.name}"]`).prop('checked', 'true');
  })
  $('input[type="radio"]').each(function() {
    const value = sessionStorage.getItem(this.name);
    $(`input[name="${this.name}"][value="${value}"]`).prop('checked', 'true');
  })
  $('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), textarea').each(function() {
    const value = sessionStorage.getItem(this.name);
    if (value !== null) {
      $(`[name="${this.name}"]`).val(value);
    }
  })

  const files = sessionStorage.getItem('files')
  if (files) {
    console.log(files.split("_"));
  }

  $('input[type="checkbox"]').on('change', function() {
    sessionStorage.setItem(this.name, $(this).is(':checked'));
  })
  $('input:not([type="checkbox"]):not([type="file"]), textarea').on('input', function() {
    sessionStorage.setItem(this.name, this.value);
  })

  // Default to Basic slideshow.
  if ($('input[name="slideshow-type"]:checked').length === 0) {
    $('input[value="basic"]').prop('checked', 'true');
  }

  // Update style if Premium.
  if ($('input[value="premium"]').is(':checked')) {
    $('body').addClass('premium');
  }

  if ($('#add-images')[0].files.length) {
    displayImages($('#add-images')[0].files);
  }
})();
