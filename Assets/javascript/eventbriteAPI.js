var map;
var geocoder;

//initialize google map, called back from <script>
function initMap() {
  var myLatLng = {lat: 47.606, lng: -122.332};

  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 10,
  center: myLatLng
  });

  geocoder = new google.maps.Geocoder();

  //upon submit or pagenumber buttons are clicked, update map with new markers
  $(document).on("click", ".updateMap", function(){
    
    $("#map").removeClass('mapHidden');
    $("#map").attr('class', 'mapDisplayed')
    //console.log("mapUpdated")
    //geocodeAddress(geocoder, map);
  })

  //call changeMapCenter when submit is clicked
  /* $(document).on("click", ".newSearch", function(){
    changeMapCenter()
  })
   */
  console.log("map generated")

}

//take LatLong and make targetMap centered at them
function changeMapCenter(centerLatLng, targetMap){
  targetMap.setCenter(centerLatLng);
}

// take localaddress, create a marker and put it on resultsMap
function geocodeAddress(Localaddress, geocoder, resultsMap) {
  geocoder.geocode({'address': Localaddress}, function(results, status) {
    if (status === 'OK') {
      console.log("new marker")
      console.log(results);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      marker.setMap(map);
    } else {
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

$(document).ready(function() {

  // OAuth Token. (This should probably be encrypted but it's OK for now)
  var auth = "FGSMQANMR2CUSP7RFDDL";
  // URL to get a list of all events Eventbrite has. (For debug purposes. Not currently in use.)
  var allEventURL = "https://www.eventbriteapi.com/v3/events/search/?token=" + auth;
  // URL to get a list of all categories Eventbrite has.
  var catURL = "https://www.eventbriteapi.com/v3/categories/?token=" + auth;
  // URL to get a list of all subcategories Eventbrite has. (For debug purposes. Not currently in use.)
  var subcatURL = "https://www.eventbriteapi.com/v3/subcategories/?token=" + auth;
  // The URL to be queried. Modified as necessary.
  var queryURL = "";
  // Used in generating results page buttons
  var initialQuery = true;
  // Used in deciding which buttons to show at a given time.
  var currentPage = 1;
  // Total number of page buttons. Used in page navigation.
  var numButtons = 0;
  // Array of Lat Lng of events on the current page
  var map;

  

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
    disableButtons(0);
    initialQuery = true;
    $("#results-buttons-up").empty();
    $("#results-buttons-down").empty();
    
    // ---positioning the map after on click 
    $('#map').addClass('active');
    //  $('#pop-searches').hide();
    $('#centerpiece h4').hide();


    var categoryPiece = "";
    var startDatePiece = "";
    var endDatePiece = "";
    var keywordPiece = "";

    var selectedStartDate = $("#start-event").val();
    var selectedEndDate = $("#end-event").val();
    var selectedKeyword = $("#keyword").val();
    
    if(selectedStartDate <= selectedEndDate) {
      var selectedCat = $('#event-type').val();
      var selectedCatName = $('#event-type option:selected').text();
      var radius = $("#event-location-radius").val();
      $("#initial-text").css("display", "none");

      if(selectedCat === null) {
        return;
      }

      // creating a temp obj to hold values. Yin
      var newObj = {
          category: categoryPiece,
          categoryName:selectedCatName,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          radius: radius
      };

    // push values from the temp newobj to fb.  
    
      var database = firebase.database();
      database.ref().push(newObj);
      console.log(newObj);
      console.log(newObj.startDate);
      console.log(newObj.endDate);


      var latitude = coordinates.lat; // Taken from placesAPI.js
      var longitude = coordinates.lng; // Taken from placesAPI.js
      if(latitude === undefined || longitude === undefined || selectedCat === undefined || radius === undefined) {
        console.log("Vital field not filled");
        enableButtons(0);
        return;
      }
      
      if(parseInt(selectedCat) !== -1) {
        categoryPiece = "&categories=" + selectedCat;
      } 
      if(selectedStartDate !== "" && selectedStartDate !== undefined) {
        startDatePiece = "&start_date.range_start=" + selectedStartDate + "T00:00:01Z";
      }
      if(selectedEndDate !== "" && selectedEndDate !== undefined) {
        endDatePiece = "&start_date.range_end=" + selectedEndDate + "T00:00:01Z";
      }
      if(selectedKeyword !== "" && selectedKeyword !== undefined) {
        keywordPiece = "&q=" + selectedKeyword;
      }
    
      queryURL = "https://cors-anywhere.herokuapp.com/https://www.eventbriteapi.com/v3/events/search/?location.longitude=" + longitude + "&location.latitude=" + 
        latitude + "&location.within=" + radius + "mi" + categoryPiece + startDatePiece + endDatePiece + keywordPiece + "&sort_by=distance" + 
        "&expand=venue,ticket_availability,format" + "&token=" + auth;

        console.log(queryURL);

      getEvents(queryURL);
    } 

    // The user entered a start date that's later than the end. Display an error message. 
    else {
      console.log("Invalid date entry: Start date later than end date");
    }
  }); 

  // Set up results page switch function
  $("#page-sub").click(function() {
    if($("#go-to-page").val().match(/^-?\d+\.?\d*$/) && $("#go-to-page").val() <= numButtons && $("#go-to-page").val() > 0) {
      disableButtons(numButtons);
      getEvents(queryURL +  "&page=" + parseInt($("#go-to-page").val()));
      shiftButtons($("#go-to-page").val(), numButtons);
    } else {
      console.log("Not a valid page #");
    }
  });

  function getEvents(URL) {
    // Gets a list of events.
    $.ajax({
      url: URL,
      method: "GET"
    }).then(function(response) {
      console.log("Events: !!");
      console.log(response);

      $("#results-page").empty();
      if(initialQuery) {
        initialQuery = false;
        currentPage = 1;

        // Make results buttons if this is the first search with these terms.
        for(var i = 1; i <= response.pagination.page_count; i++) {
          var newButtonUp = $("<button value='" + i + "' class='btn btn-dark' id='btn-up-" + i +"'>" + i + "</button>");
          newButtonUp.attr('class', 'updataMap');
          var newButtonDown = $("<button value='" + i + "' class='btn btn-dark' id='btn-down-" + i + "'>" + i + "</button>");  
          newButtonDown.attr('class', 'updataMap');
          newButtonDown.css("margin-right", "2px");
          newButtonUp.css("margin-right", "2px");       
          $("#results-buttons-up").append(newButtonUp);
          $("#results-buttons-down").append(newButtonDown);
          $("#btn-up-" + i).click(function() {
            disableButtons(response.pagination.page_count);
            getEvents(queryURL +  "&page=" + $(this).attr("value"));
            shiftButtons($(this).attr("value"), response.pagination.page_count);
          });
          $("#btn-down-" + i).click(function() {
            disableButtons(response.pagination.page_count);                        
            getEvents(queryURL +  "&page=" + $(this).attr("value"));
            shiftButtons($(this).attr("value"), response.pagination.page_count);
          });
        }
        numButtons = response.pagination.page_count;
        shiftButtons(1, numButtons);
        $("#page-search").css("display", "block");
      }
      for(var i = 0; i < response.events.length; i++) {
        
        var newShell = $("<div id='" + i + "-outer' class='result-shell' data-name='" + response.events[i].name.text + 
          "' data-longitude='" + response.events[i].venue.longitude + "' data-latitude='" + response.events[i].venue.latitude + 
          "' data-start='" + response.events[i].start.local + "' data-address='" + response.events[i].venue.address.localized_address_display + 
          "'>" + response.events[i].name.text + "</div>");

        var thisAddress = response.events[i].venue.address.localized_address_display;
        console.log("this latlng=");
        console.log(thisAddress);

        geocodeAddress(thisAddress, geocoder, map);

        var newInside = $("<div id='" + i + "-inner' class='result-interior collapse'>" + "This is an inner result" + "</div>");
        var linebreak = $("<br>");
        
        $("#results-page").append(newShell);
        newShell.append(newInside);
        $("#results-page").append(linebreak);
        enableButtons(numButtons);
      }
<<<<<<< HEAD



      // Recursive query for displaying all items on one page together.
      /*
      if(response.pagination.has_more_items) {
        var nextPage = response.pagination.page_number + 1
        getEvents(queryURL +  "&page=" + nextPage);
      }
      */
=======
>>>>>>> aef6d24bcf6f75a7ab54dd508e5a6b6f4db7d920
    });
  }

  function shiftButtons(curButton, totalButtons) {
    var cur = parseInt(curButton);
    var tot = parseInt(totalButtons);
    for(var j = 0; j < tot; j++) {
      $("#btn-up-" + j).css("display", "none");
      $("#btn-down-" + j).css("display", "none");
    }

    for(var i = (cur - 3); i < (cur + 4); i++) {
      $("#btn-up-" + i).css("display", "inline");
      $("#btn-down-" + i).css("display", "inline");
    }
    $("#btn-up-" + currentPage).css("background-color", "black");
    $("#btn-down-" + currentPage).css("background-color", "black");
    $("#btn-up-" + cur).css("background-color", "darkseagreen");
    $("#btn-down-" + cur).css("background-color", "darkseagreen");
    $("#btn-up-" + (tot)).css("display", "inline");
    $("#btn-down-" + (tot)).css("display", "inline");
    $("#btn-up-" + 1).css("display", "inline");
    $("#btn-down-" + 1).css("display", "inline");
    currentPage = cur;
  }

  function disableButtons(totalButtons) {
    for(var i = 0; i <= totalButtons; i++) {
      $('#btn-up-' + i).attr('disabled','disabled');
      $('#btn-down-' + i).attr('disabled','disabled');
    }
    $("#submit").attr("disabled", "disabled");
    $("#page-sub").attr("disabled", "disabled");
    $("#load").css("display", "block");
  }

  function enableButtons(totalButtons) {
    for(var i = 0; i <= totalButtons; i++) {
      $('#btn-up-' + i).removeAttr('disabled');
      $('#btn-down-' + i).removeAttr('disabled');
    }
    $("#submit").removeAttr("disabled");
    $("#page-sub").removeAttr("disabled");
    $("#load").css("display", "none");
  }

  // ---------------------------------------------------FIREBASE------------------------------------------------


  //  LIMITING ITEMS PRINTED TO DOM TO 5
  var database = firebase.database().ref().limitToLast(8);

  // CREATING A FIREBASE EVENT.
  
  database.on("child_added", function(snapshot) {
    //console.log(snapshot.val());
    
    // snapshot.ref().remove(); -------WANTING TO CLEAR THE FB DATA FOR A REFRESH START, BUT NOT WORKING

   var categoryPiece = snapshot.val().categoryName;
   console.log('hi yall')
  //   var selectedStartDate = snapshot.val().startDate;
  //   var selectedEndDate = snapshot.val().endDate;

  //  //console.log(selectedCat);
  //   //console.log(selectedStartDate);
  //   //console.log(selectedEndDate + 'end');
  //   // appending to dom
    var newRow = $('<tr>').append(
    $('<td>').text(categoryPiece),
    // $('<td>').text(selectedStartDate),
    // $('<td>').text(selectedEndDate)
    );

   $('#results-table > tbody').append(newRow);
   });
});