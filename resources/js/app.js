import $ from 'jquery';

(function(){

  // Email vs Text
  const selectContactMethod = (method) => {
    const otherMethod = $(`input.contact-info:not([name="${method}"])`).attr('id');
    $(`[for="${method}"]`).removeAttr('style');
    $(`[name="${method}"]`).removeAttr('style')
    $(`[for="${otherMethod}"]`).css('display', 'none');
    $(`[name="${otherMethod}"]`).css('display', 'none')
  }

  $('[name="contact"]').on('click', (event) => {
    selectContactMethod(event.target.value);
  });

  // Image thumbnail functionality

  const imageInput = document.getElementById('add-images');

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
    const thumb = e.target.closest('.thumb')
    const deletedIndex = $(thumb).index();

    // Remove file from input.files
    const dataTransfer = new DataTransfer();
    const fileArray = $('#add-images')[0].files;
    for (let i = 0; i < deletedIndex; i++) {
      dataTransfer.items.add(fileArray[i]);
    }
    for (let i = deletedIndex + 1; i < fileArray.length; i++) {
      dataTransfer.items.add(fileArray[i]);
    }
    $('#add-images')[0].files = dataTransfer.files;

    // Update UI.
    thumb.remove();
    updateImagesRemaining();
  }

  const displayImages = async (fileList) => {

    // Get file data and add it to promise array (to display in correct order).
    const promiseArray = [];
    for (var i = 0; i < fileList.length; i++) {
      let reader = new FileReader();
      promiseArray.push(new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(fileList[i]);
      }));
    }

    // Display images from file data.
    Promise.all(promiseArray).then((fileData) => {
      fileData.forEach((file) => {
        const thumb = $(`<div class="gallery-item thumb"><img src="${file}"></div>`);
        const deleteButton = $('<button class="delete"><img src="/img/x.png"></button>');
        deleteButton.on('click', deleteImage);
        thumb.append(deleteButton);
        thumb.insertBefore($('.gallery-item:last-child'));
      })

      // Update 'images remaining' label.
      updateImagesRemaining();
    });
  }

  // Saves previously uploaded files to prepend to input.files
  $(imageInput).on('click', function(e) {
    this.oldFiles = this.files;
  });

  $(imageInput).on('change', function(e) {
    e.preventDefault()

    // Display newly added images.
    displayImages(this.files);

    // Update input.files to contain both previous and new files.
    const dataTransfer = new DataTransfer();
    const fileArray = [...this.oldFiles, ...this.files];
    for (let i = 0; i < fileArray.length; i++) {
      dataTransfer.items.add(fileArray[i]);
    }
    this.files = dataTransfer.files;
  });

  // Add keyboard functionality to 'add images' input (which is actually a label).
  $('label[for="add-images"]').on('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      imageInput.click();
    }
  })

  // Basic vs Premium
  $('#select-premium').on('click', function() {
    $('body').addClass('premium');
    updateImagesRemaining();
  });
  $('#select-basic').on('click', function() {
    $('body').removeClass('premium');
    updateImagesRemaining();
  });

  // Initialize form state from browser data
  if ($('#select-premium:checked').length > 0) {
    $('body').addClass('premium');
  }
  if ($('#add-images')[0].files.length) {
    displayImages($('#add-images')[0].files);
  }
  if ($('#contact-text:checked').length > 0) {
    selectContactMethod('text');
  }
})();
