
// jQuery time
var current_fs, next_fs, previous_fs; // fieldsets
var left, opacity, scale; // fieldset properties which we will animate
var animating; // flag to prevent quick multi-click glitches

// Function to validate user input
function validateInput(current_fs) {
  var startDate = $("#start_date").val();
  var endDate = $("#end_date").val();
  var monthlyWage = $("#monthly_wage").val();

  console.log($("#start_date").val());
  console.log($("#end_date").val());

  if (current_fs.hasClass("first-fieldset") && (!startDate || !endDate)) {
    alert("Please enter a valid start and end date.");
    /*console.log(startDate);
    console.log(endDate);*/
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
    reckonableYears = Math.floor(daysOfService / 365);
  }
  return reckonableYears;
}

//function to calculate the days in incomlete year
function calculateDaysInIncompleteYear(daysOfService, reckonableYears){
  var daysInIncompleteYear = 0;
  daysInIncompleteYear = daysOfService - (365 * reckonableYears);
  return daysInIncompleteYear
}

function calculatePaymentIncompleteYear(daysOfService, reckonableYears, lastMonthWage) {
  console.log("daysofservice:"+daysOfService);
  var daysInIncompleteYear = 0;
  var paymentIncompleteYear = 0;
  daysInIncompleteYear = daysOfService - (365 * reckonableYears);
  if (reckonableYears > 0) {
    paymentIncompleteYear = 2/3 * lastMonthWage * daysInIncompleteYear / 365;
  }
  console.log("daysInIncompleteYear:"+ daysInIncompleteYear);
  console.log("paymentIncompleteYear:"+ paymentIncompleteYear);
  return paymentIncompleteYear;
}

// Function to calculate long service payment
function calculateLongServicePayment(reckonableYears, lastMonthWage) {
  var longServicePayment = 0;
  if (reckonableYears >= 5) {
    longServicePayment = (lastMonthWage * 2 / 3) * reckonableYears;
  }
  return longServicePayment;
}

function calculateTotalPayment(daysOfService, reckonableYears, lastMonthWage) {
  var TotalPayment = 0;
  var paymentIncompleteYear = calculatePaymentIncompleteYear(daysOfService, reckonableYears, lastMonthWage);
  var longServicePayment = calculateLongServicePayment(reckonableYears, lastMonthWage);
  TotalPayment = paymentIncompleteYear + longServicePayment;
  return(TotalPayment);
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

//function to add the explanation when reckonableYears is 0
function updateReckonableAndLongServiceMessages(reckonableYears, longServicePayment) {
  var $reckonableYearsText = $("#result_reckonable_years");
  var $incompleteYearText = $("#result_days_incomplete_year");
  var $longServicePaymentText = $("#result_long_service_payment");

  // Check if reckonable years is zero and update message accordingly
  if (reckonableYears == 0) {
    $reckonableYearsText.addClass("small-italic-message").text("Not Eligibile");
    $incompleteYearText.addClass("small-italic-message").text("Not Eligibileg");
  } else {
    $reckonableYearsText.removeClass("small-italic-message");
    $incompleteYearText.removeClass("small-italic-message");
  }

  // Check if long service payment is zero and update message accordingly
  if (longServicePayment == 0) {
    $longServicePaymentText.addClass("small-italic-message").text("$0 HKD");
  } else {
    $longServicePaymentText.removeClass("small-italic-message");
  }

}

// Function to update the results 
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
  console.log("reckonableYears:" + reckonableYears);
  var daysInIncompleteYear = calculateDaysInIncompleteYear(daysOfService, reckonableYears);
  console.log("daysInIncompleteYear:" + daysInIncompleteYear);
  var longServicePayment = calculateLongServicePayment(reckonableYears, monthlyWage);
  var paymentIncompleteYear = calculatePaymentIncompleteYear(daysOfService, reckonableYears, monthlyWage)
  var TotalPayment = calculateTotalPayment(daysOfService, reckonableYears, monthlyWage);

  console.log("TotalPayment: " + TotalPayment);
 /* console.log("paymentIncompleteYear: " + paymentIncompleteYear);*/
  console.log("longServicePayment:" + longServicePayment);

  function updateResultFields() {
    $("#result_monthly_wage").attr("data-before", "Last Month's Wage").text("$" + parseInt(monthlyWage) + " HKD");
    $("#result_start_date").attr("data-before", "Start Date").text(startDate);
    $("#result_end_date").attr("data-before", "End Date").text(endDate);
    $("#result_days_of_service").attr("data-before", "Days of Service").text(daysOfService + " days");
    $("#result_reckonable_years").attr("data-before", "Reckonable Years of Service").text(parseInt(reckonableYears) + " years");
    $("#result_days_incomplete_year").attr("data-before", "Days in Incomplete Year").text(parseInt(daysInIncompleteYear) + " days");
    $("#result_long_service_payment").attr("data-before", "Payment for Reckonable Years").text("$" + parseInt(longServicePayment) + " HKD");
    $("#formula_payment_reckonable_years").attr("data-before", "").text(parseInt(longServicePayment) + " = 2/3 * " + parseInt(monthlyWage) + " * " + parseInt(reckonableYears));
    $("#result_payment_incomplete_year").attr("data-before", "Payment for Incomplete Year").text("$" + parseInt(paymentIncompleteYear) + " HKD");
    $("#formula_payment_incomplete_year").attr("data-before", "").text(parseInt(paymentIncompleteYear) + " = 2/3 * " + parseInt(daysInIncompleteYear) + " / 365");
    $("#result_total_payment").attr("data-before", "Total Payment").text("$" + parseInt(TotalPayment) + " HKD");
    $("#result_total_payment_detail").attr("data-before", "Total Payment").text("$" + parseInt(TotalPayment) + " HKD");
  
    updateReckonableAndLongServiceMessages(reckonableYears, longServicePayment);
  }
  
  $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

  updateResultFields();
  next_fs.show();

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

//restart button
$(".restart").click(function() {
  setTimeout(function() {
    location.reload();
  }, 150);
});


//save button

$('.save').click(function() {
  alert("This feature is coming soon! Thanks for your patience :) ")
  
  // var element = document.querySelector('.result-page');
  // var opt = {
  //   filename:     'calculation-of-payment.pdf',
  //   jspdf: { orientation: 'portrait', format: [400.00, 2800.00]}
  //   /*
  //   margin:       [1,1,1,1],
  //   pagebreak:    {after: ['form']}
  //   */
  // };
  // html2pdf().set(opt).from(element).save();*/
});


