$(document).ready(function() {

  // OAuth Token. (This should probably be encrypted but it's OK for now) 
  var auth = "FGSMQANMR2CUSP7RFDDL";

  // URL to get a list of all events Eventbrite has. (For debug purposes. Not currently in use.)
  var allEventURL = "https://www.eventbriteapi.com/v3/events/search/?token=" + auth;
  // URL to get a list of all categories Eventbrite has.
  var catURL = "https://www.eventbriteapi.com/v3/categories/?token=" + auth;
  // URL to get a list of all subcategories Eventbrite has. (For debug purposes. Not currently in use.)
  var subcatURL = "https://www.eventbriteapi.com/v3/subcategories/?token=" + auth;

  // Get list of Eventbrite categories and append them to #event-type dropdown
  $.ajax({
    url: catURL,
    method: "GET"
  })
  .then(function(response) {
    for(var i = 0; i < response.categories.length; i++) {
      var newOption = $("<option id='" + response.categories[i].short_name + "' value='" + response.categories[i].id +  "'>" + response.categories[i].short_name + "</option>");
      $("#event-type").append(newOption);
    }
  });

  /*
  // Get list of Eventbrite subcategories (Not currently in use. Might implement somehow later.)
  $.ajax({
    url: subcatURL,
    method: "GET"
  })
  .then(function(response) {
    console.log("Subcategories: ");
    console.log(response);
  });
  */

  $("#submit").click(function() {
    var selectedCat = $('#event-type').val();
    var selectedStartDate = $("#start-event").val();
    var selectedEndDate = $("#end-event").val();
    var radius = 10;

    // Use the radius decleration below once this script is attached to HTML that includes the radius dropdown:

    //var radius = $("#event-location-radius").val();

    var latitude = "47.620422";
    var longitude = "-122.349358";
    // User picked "Any" category; category field is omitted.
    if(parseInt(selectedCat) === -1) {
      getEvents("https://www.eventbriteapi.com/v3/events/search/?location.longitude=" + longitude + "&location.latitude=" + 
        latitude + "&location.within=" + radius + "mi&start_date.range_start=" + selectedStartDate + 
        "T00:00:01Z" + "&start_date.range_end=" + selectedEndDate + "T00:00:01Z" + "&token=" + auth);
    } // User picked a category; category field is included.
    else {
      getEvents("https://www.eventbriteapi.com/v3/events/search/?location.longitude=" + longitude + "&location.latitude=" + 
        latitude + "&location.within=" + radius + "mi&categories=" + selectedCat + "&start_date.range_start=" + selectedStartDate + 
        "T00:00:01Z" + "&start_date.range_end=" + selectedEndDate + "T00:00:01Z" + "&token=" + auth);
    }
  });

  function getEvents(URL) {
    // Gets a list of events.
    $.ajax({
      url: URL,
      method: "GET"
    })
    .then(function(response) {
      console.log("Events: ");
      console.log(response);
    });
  }
});