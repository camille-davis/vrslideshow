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
})();
