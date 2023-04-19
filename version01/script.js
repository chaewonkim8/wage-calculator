
// jQuery time
var current_fs, next_fs, previous_fs; // fieldsets
var left, opacity, scale; // fieldset properties which we will animate
var animating; // flag to prevent quick multi-click glitches

// Function to validate user input
function validateInput(current_fs) {
  var startDate = $("#start_date").val();
  var endDate = $("#end_date").val();
  var monthlyWage = $("#monthly_wage").val();

  if (current_fs.hasClass("first-fieldset") && (!startDate || !endDate)) {
    alert("Please enter a valid start and end date.");
    return false;
  }

  if (current_fs.hasClass("second-fieldset") && (!monthlyWage || monthlyWage <= 0)) {
    alert("Please enter a valid monthly wage.");
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

// Function to calculate long service payment
function calculateLongServicePayment(reckonableYears, lastMonthWage) {
  var longServicePayment = 0;
  if (reckonableYears >= 5) {
    longServicePayment = (lastMonthWage * 2 / 3) * reckonableYears;
  }
  return longServicePayment;
}

// Function for the animation of the current fieldset
function current_fs_animation(current_fs, next_fs, callback) {
  current_fs.animate(
    { opacity: 0 },
    {
      step: function (now, mx) {
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
      complete: callback,
      easing: "easeInOutBack"
    }
  );
}


// Function to animate the form 
function animateForm(current_fs, next_fs) {
  if (animating) return false;
  animating = true;

  if (!validateInput(current_fs)) {
    return false;
  }

  var startDate = $("#start_date").val();
  var endDate = $("#end_date").val();
  var monthlyWage = $("#monthly_wage").val();

  var daysOfService = calculateDaysOfService(startDate, endDate);
  var reckonableYears = calculateReckonableYearsOfService(daysOfService);
  var longServicePayment = calculateLongServicePayment(reckonableYears, monthlyWage);
  
  function updateResultFields() {
    $("#result_start_date").attr("data-before", "Start Date").text(startDate);
    $("#result_end_date").attr("data-before", "End Date").text(endDate);
    $("#result_days_of_service").attr("data-before", "Days of Service").text(daysOfService);
    $("#result_reckonable_years").attr("data-before", "Reckonable Years of Service").text(reckonableYears.toFixed(2));
    $("#result_long_service_payment").attr("data-before", "Long Service Payment").text(longServicePayment.toFixed(2));
  }

  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  next_fs.show();
  updateResultFields();

  current_fs_animation(current_fs, next_fs, function () {
    current_fs.hide();
    animating = false;
  });
}


// Function to handle click event
$(".next").click(function () {
  var current_fs = $(this).parent();
  var next_fs = $(this).parent().next();

  animateForm(current_fs, next_fs);
});

$(".previous").click(function () {
  if (animating) return false;
  animating = true;

  current_fs = $(this).parent();
  previous_fs = $(this).parent().prev();

  //de-activate current step on progressbar
  $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

  //show the previous fieldset
  previous_fs.show();
  //hide the current fieldset with style
  current_fs.animate({ opacity: 0 }, {
    step: function (now, mx) {
      //as the opacity of current_fs reduces to 0 - stored in "now"
      //1. scale previous_fs from 80% to 100%
      scale = 0.8 + (1 - now) * 0.2;
      //2. take current_fs to the right(50%) - from 0%
      left = ((1 - now) * 50) + "%";
      //3. increase opacity of previous_fs to 1 as it moves in
      opacity = 1 - now;
      current_fs.css({ 'left': left });
      previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
    },
    duration: 800,
    complete: function () {
      current_fs.hide();
      animating = false;
    },
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
  });
});

