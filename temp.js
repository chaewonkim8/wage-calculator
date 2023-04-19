// Function to validate user input
function validateInput(current_fs) {
    var startDate = $("#start_date").val();
    var endDate = $("#end_date").val();
  
    if (current_fs.hasClass("first-fieldset") && (!startDate || !endDate)) {
      console.error("Please enter a valid start and end date.");
      return false;
    }
  
    return true;
  }
  
  // Function to calculate days of service
  function calculateDaysOfService(startDate, endDate) {
    var startDt = new Date(startDate);
    var endDt = new Date(endDate);
  
    var timeDifference = endDt - startDt;
    var daysOfService = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  
    return daysOfService;
  }
  
  // Function to calculate reckonable years of service
  function calculateReckonableYearsOfService(daysOfService) {
    var reckonableYears = 0;
    if (daysOfService / 365 >= 5) {
      reckonableYears = daysOfService / 365;
    }
    return reckonableYears;
  }
  
  // Function to animate the form
  function animateForm(current_fs, next_fs) {
    if (animating) return false;
    animating = true;
  
    var startDate = $("#start_date").val();
    var endDate = $("#end_date").val();
  
    if (!validateInput(current_fs)) {
      return false;
    }
  
    var daysOfService = calculateDaysOfService(startDate, endDate);
  
    var reckonableYears = calculateReckonableYearsOfService(daysOfService);
  
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
  
    next_fs.show();
  
    current_fs.animate(
      { opacity: 0 },
      {
        step: function(now, mx) {
          var scale = 1 - (1 - now) * 0.2;
          var left = now * 50 + "%";
          var opacity = 1 - now;
  
          current_fs.css({
            transform: "scale(" + scale + ")",
            position: "absolute"
          });
          next_fs.css({ left: left, opacity: opacity });
        },
        duration: 800,
        complete: function() {
          current_fs.hide();
          animating = false;
        },
        easing: "easeInOutBack"
      }
    );
  }
  
  // Function to handle click event
  $(".next").click(function() {
    var current_fs = $(this).parent();
    var next_fs = $(this).parent().next();
    
    animateForm(current_fs, next_fs);
  });
  