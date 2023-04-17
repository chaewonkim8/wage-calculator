/*
document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get input values
    var startDate = document.getElementById("start_date").value;
    var endDate = document.getElementById("end_date").value;
    var lastMonthWage = document.getElementById("last_month_wage").value;
  
    // Calculate days of service
    var daysOfService = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / (24 * 60 * 60 * 1000));
  
    // Calculate long service payment
    var longServicePayment = 0;
    if (daysOfService / 365 >= 5) {
      longServicePayment = (lastMonthWage * 2/3) * (daysOfService / 365);
    }
  
    // Update result elements
    document.getElementById("result_start_date").textContent = startDate;
    document.getElementById("result_end_date").textContent = endDate;
    document.getElementById("result_days_of_service").textContent = daysOfService;
    document.getElementById("result_long_service_payment").textContent = longServicePayment.toFixed(2);
  });
*/

document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get input values
    var startDate = document.getElementById("start_date").value;
    var endDate = document.getElementById("end_date").value;
    var lastMonthWage = document.getElementById("last_month_wage").value;
  
    // Calculate days of service
    var daysOfService = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / (24 * 60 * 60 * 1000));
  
    // Calculate reckonable years of service
    var reckonableYears = 0;
    if (daysOfService / 365 >= 5) {
      reckonableYears = daysOfService / 365;
    }
  
    // Calculate long service payment
    var longServicePayment = 0;
    if (reckonableYears >= 5) {
      longServicePayment = (lastMonthWage * 2/3) * reckonableYears;
    }
  
    // Update result elements
    document.getElementById("result_start_date").textContent = startDate;
    document.getElementById("result_end_date").textContent = endDate;
    document.getElementById("result_reckonable_years").textContent = reckonableYears.toFixed(2);
    document.getElementById("result_days_of_service").textContent = daysOfService;
    document.getElementById("result_long_service_payment").textContent = longServicePayment.toFixed(2);
  });
  