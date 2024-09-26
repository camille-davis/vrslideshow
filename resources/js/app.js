import $ from 'jquery';

(function(){

  // Basic vs Premium
  if ($('#select-premium:checked').length > 0) {
    $('body').addClass('premium');
  }
  $('#select-premium').on('click', function() {
    $('body').addClass('premium');
  });
  $('#select-basic').on('click', function() {
    $('body').removeClass('premium');
  });

  // Email vs Text
  const selectContactMethod = (method) => {
    const otherMethod = $(`input.contact-info:not([name="${method}"])`).attr('id');
    $(`[for="${method}"]`).removeAttr('style');
    $(`[name="${method}"]`).removeAttr('style')
    $(`[for="${otherMethod}"]`).css('display', 'none');
    $(`[name="${otherMethod}"]`).css('display', 'none')
  }
  // 'email' is default, so just check if 'text' is checked on load.
  if ($('#contact-text:checked').length > 0) {
    selectContactMethod('text');
  }
  $('[name="contact"]').on('click', (event) => {
    selectContactMethod(event.target.value);
  });

  // Image thumbnail functionality

  const imageInput = document.getElementById('add-images');

  // Display images from FileList.
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
        $(`<div class="gallery-item"><img src="${file}"></div>`).insertBefore($('.gallery-item:last-child'));
      })
    });
  }

  // Display any images already present in file input.
  if ($('#add-images')[0].files.length) {
    displayImages($('#add-images')[0].files);
  }

  // Save previously uploaded files to prepend to input.files
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
})();
