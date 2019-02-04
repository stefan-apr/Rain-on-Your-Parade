$(document).ready(function() {

  $('.card-display').hide();

  // OAuth Token. (This should probably be encrypted but it's OK for now)
  var auth = "FGSMQANMR2CUSP7RFDDL";

  // URL to get a list of all events Eventbrite has. (For debug purposes. Not currently in use.)
  var allEventURL =
    "https://www.eventbriteapi.com/v3/events/search/?token=" + auth;
  // URL to get a list of all categories Eventbrite has.
  var catURL = "https://www.eventbriteapi.com/v3/categories/?token=" + auth;
  // URL to get a list of all subcategories Eventbrite has. (For debug purposes. Not currently in use.)
  var subcatURL =
    "https://www.eventbriteapi.com/v3/subcategories/?token=" + auth;

  // Get list of Eventbrite categories and append them to #event-type dropdown
  $.ajax({
    url: catURL,
    method: "GET"
  }).then(function(response) {
    for (var i = 0; i < response.categories.length; i++) {
      var newOption = $(
        "<option id='" +
          response.categories[i].short_name +
          "' value='" +
          response.categories[i].id +
          "'>" +
          response.categories[i].short_name +
          "</option>"
         
      );
      $("#event-type").append(newOption); 
      // console.log(response.categories[i].short_name + 'yay')
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

    // to hide the html elements on the landing page on click to show the results.Yin
    $('.card').hide();
    $('.text').hide();
    $('#one').hide();
    $('.card-display').show();

    var selectedCat = $("#event-type").val();
    var selectedStartDate = $("#start-event").val();
    var selectedEndDate = $("#end-event").val();
    var radius = 10;

    // creating a temp obj to hold values. Yin
    var newObj = {
        category: selectedCat,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        radius: 10
    };

    // push values from the temp newobj to fb
    database.ref().push(newObj);
      console.log(newObj);
      console.log(newObj.startDate);
      console.log(newObj.endDate);
    
    // clearing the input boxes.
    $("#event-type").val("");
    $("#start-event").val("");
    $("#end-event").val("");



    // Use the radius decleration below once this script is attached to HTML that includes the radius dropdown:

    //var radius = $("#event-location-radius").val();

    var latitude = "47.620422";
    var longitude = "-122.349358";
    // User picked "Any" category; category field is omitted.
    if (parseInt(selectedCat) === -1) {
      getEvents(
        "https://www.eventbriteapi.com/v3/events/search/?location.longitude=" +
          longitude +
          "&location.latitude=" +
          latitude +
          "&location.within=" +
          radius +
          "mi&start_date.range_start=" +
          selectedStartDate +
          "T00:00:01Z" +
          "&start_date.range_end=" +
          selectedEndDate +
          "T00:00:01Z" +
          "&token=" +
          auth
      );
    } // User picked a category; category field is included.
    else {
      getEvents(
        "https://www.eventbriteapi.com/v3/events/search/?location.longitude=" +
          longitude +
          "&location.latitude=" +
          latitude +
          "&location.within=" +
          radius +
          "mi&categories=" +
          selectedCat +
          "&start_date.range_start=" +
          selectedStartDate +
          "T00:00:01Z" +
          "&start_date.range_end=" +
          selectedEndDate +
          "T00:00:01Z" +
          "&token=" +
          auth
      );
    }
  });

  function getEvents(URL) {
    // Gets a list of events.
    $.ajax({
      url: URL,
      method: "GET"
    }).then(function(response) {
      console.log("Events: !");
      console.log(response);

   

    });
  }



  // ---------------------------------------------------FIREBASE------------------------------------------------
 
  var database = firebase.database();

  // CREATING A FIREBASE EVENT.
  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());
    console.log('hi');

    var selectedCat = snapshot.val().category;
    var selectedStartDate = snapshot.val().startDate;
    var selectedEndDate = snapshot.val().endDate;

    console.log(selectedCat);
    console.log(selectedStartDate);
    console.log(selectedEndDate + 'end');
    // appending to dom
    var newRow = $('<tr>').append(
    $('<td>').text(selectedCat),
    $('<td>').text(selectedStartDate),
    $('<td>').text(selectedEndDate)
    );

    $('#results-table > tbody').append(newRow);
  });

});
