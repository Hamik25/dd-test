$(document).ready(function() {
  
  var requestMethods = $('#request-method-input > button');

  var requestUrl     = $('#request-url-input'),
      requestMethod  = 'GET',
      requestBody    = $('#request-body-input'),
      requestCount   = $('#request-count-input'),
      requestHeaders = $('#request-headers-input');

  function toggleRequestBody() {
    if (requestMethod === 'POST') {
      requestBody.parent('.form-group').show();
    } else {
      requestBody.parent('.form-group').hide();
    }
  };
  toggleRequestBody();

  requestMethods.each(function(index, method) {
    $(method).on('click', function() {
      requestMethod = $(this).attr('data-value');
      toggleRequestBody();

      requestMethods.each(function(index, item) {
        $(item).removeClass('active');  
      });
      $(this).addClass('active');
    });
  });

  var pageRowCount = 10;
  var arrowUp = '';
  var arrowDown = '';

  $('#response-table').bdt();

  
  $('#start-request-btn').on('click', function() {
    var url     = requestUrl.val(),
        headers = requestHeaders.val(),
        method  = requestMethod,
        data    = requestBody.val();

    // $('#sucess-alert').addClass('hide');
    // $('#info-alert').removeClass('hide');

    var request = getRequestFunction(url, method, data, headers, function(data, status, xhr) {
      // console.log(data); 
      // console.log(index);
      $('#response-list').append('<tr class="' + status + '"><td>' + xhr.status + '</td><td>' + status + '</td></tr>');
    });

    for (var i = 0; i < requestCount.val(); i++) {
      request(i);
    }
  });

  function getRequestFunction(url, method, data, headers, doneFunction) {
    if (!data || method !== 'POST') {
      return function(index) {
        $.ajax({
          url: url,
          beforeSend: function(request) {
            request.setRequestHeader(headers);
          },
          method: method
        })
        .done(doneFunction);

        // if (index+1 == requestCount.val()) {
        //   $('#info-alert').addClass('hide');
        //   $('#sucess-alert').removeClass('hide');
        // }
      };
    } else {
      return function(index) {
        $.ajax({
          url: url,
          crossDomain: true,
          method: method,
          data: {data: data}
        })
        .done(doneFunction);
      };
    }
  }

});