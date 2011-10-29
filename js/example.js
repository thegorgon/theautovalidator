$(document).ready(function(e) {
  $('[data-toggle-class]').bind('click', function(e) {
    var $this = $(this);
    e.preventDefault();
    $this.parents($this.attr('rel')).toggleClass($this.attr('data-toggle-class'));
  });
  
  $('#example1 form').autovalidator({
    name: 1,
    change: function(event, validator) {
      var container = $(event.target).parent();
      container.removeClass('invalid').removeClass('valid').removeClass('loading').addClass(event.status);
      container.find('.errors').html(event.status == "loading" ? "loading..." : event.message || "");
    }
  });

  $('#example2 form').autovalidator({
    name: 2,
    change: function(event, validator) {
      var container = $(event.target).parent(),
        errors = validator.errors();            
      container.removeClass('invalid').removeClass('valid').removeClass('loading').addClass(event.status);

      if (errors.length > 0) {
        $(this).find('.error-messages').html(errors[0]);
      } else {
        $(this).find('.error-messages').html('');            
      }

    }
  });

  $('#example3 form').autovalidator({
    name: 3,
    change: function(event, validator) {
      var container = $(event.target).parent();
      container.removeClass('invalid').removeClass('valid').removeClass('loading').addClass(event.status);
      container.find('.errors').html(event.status == "loading" ? "loading..." : event.message || "");
    }
  });

  $('#example3 form').autovalidator('registerEach', [{
    name: 'luhn',
    selector: '[name=credit-card-number]',
    message: function() {
      return "please double check your credit card number";
    },
    test: function(element) {
      var sum = 0, flip = true, i, digit, value = element.val();
      for (i = value.length - 1; i >=0; i--) {
        digit = parseInt(value.charAt(i), 10);
        sum += (flip = flip ^ true) ? Math.floor((digit * 2)/10) + Math.floor(digit * 2 % 10) : digit;
      }

      this.validity(element, sum % 10 === 0);
    }
  },
  {
    name: 'expiration',
    selector:'[name^=expiration-]',
    message: function() {
      return "looks like your card is expired?";
    },
    onChange: false,
    test: function(element) {
      var yearField, monthField, year, month, validity, now = (new Date());
      if (element.attr('name') == 'expiration-month') {
        yearField = element.siblings('[name=expiration-year]');
        monthField = element;
      } else if (element.attr('name') == 'expiration-year') {
        monthField = element.siblings('[name=expiration-month]');
        yearField = element;
      }
      year = yearField.val() - 0;
      month = monthField.val() - 0;
      validity = year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
      this.validity(monthField, validity);
      this.validity(yearField, validity);
    }
  }]);

  $('#example4 form').autovalidator({
    name: 4,
    change: function(event, validator) {
      var container = $(event.target).parent();
      container.removeClass('invalid').removeClass('valid').removeClass('loading').addClass(event.status);
      container.find('.errors').html(event.status == "loading" ? "loading..." : event.message || "");
    }
  });

  $('#example4 form').autovalidator('register', {
    name: "server_check",
    selector: "#server-validated",
    onSubmit: false,
    message: "cannot find ${name} '${val}' amongst Yahoo artists",
    test: function(element) {
      var val = element.val(),
        self = this,
        error = function() {
          self.validity(element, false);
        };
      this.loading(element);
      $.ajax({
        data: {q: "select * from music.artist.search where keyword='" + val + "'", format: "json"},
        url: "http://query.yahooapis.com/v1/public/yql",
        dataType: 'jsonp',
        success: function(data) {
          if (data.query.count - 0 > 0) {
            self.validity(element, true);
          } else {
            error();
          }
        }, error: error
      });
    }
  });

  $('form').submit(function(e) {
    e.preventDefault();
    if ($(this).data('autovalidator').validate()) {
      alert("SUBMIT!");
    }
    return false;
  });
});