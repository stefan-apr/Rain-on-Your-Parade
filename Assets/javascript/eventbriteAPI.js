var map;
var geocoder;
var markers = [];
var cityLocation;

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
function geocodeAddress(Localaddress, geocoder, resultsMap, divID, markerName) {
  geocoder.geocode({'address': Localaddress}, function(results, status) {
    if (status === 'OK') {
      //console.log("new marker")
      //console.log(results);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        title: markerName,
        url : '#' + divID
      });
      marker.addListener('click', function(e) {
        map.setCenter(marker.getPosition());
        //console.log(marker.label);
        var autoScrollDes = $(marker.url).offset().top;
        $('html, body').animate({
          scrollTop: autoScrollDes
        }, 500, 'linear');

      });
      markers.push(marker);
      marker.setMap(map);
    } else {
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  console.log("deleting markers")
  setMapOnAll(null); 
  markers = [];
} 

//set center to the searched city
$(".newSearch").on("click", function(){
  cityLocation = $("#locationInput").val()
  geocoder.geocode({'address': cityLocation}, function(results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
    } else {
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  })
})

$(".updateMap").on("click", function(){
  clearMarkers()
  $("#map").removeClass('mapHidden');
  //$("#map").attr('class', 'mapDisplayed')
  console.log("oooooooverrrr")
})

$(document).ready(function() {

  // OAuth Token. (This should probably be encrypted but it's OK for now)
  var auth = "FGSMQANMR2CUSP7RFDDL";
  // URL to get a list of all categories Eventbrite has.
  var catURL = "https://www.eventbriteapi.com/v3/categories/?token=" + auth;
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

  $("#submit").click(function() {
    $("#no-results").css("display", "none");
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

      if(selectedCat === null || radius === null) {
        console.log("Somehow, a dropdown value was null. That's not supposed to be possible.");
        enableButtons(0);
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
        if(response.events.length === 0) {
          $("#no-results").css("display", "block");
          enableButtons(0);
          $("#page-search").css("display", "none");
          return; 
        }

        // Make results buttons if this is the first search with these terms.
        for(var i = 1; i <= response.pagination.page_count; i++) {
          var newButtonUp = $("<button value='" + i + "' class='btn btn-dark' id='btn-up-" + i +"'>" + i + "</button>");
          newButtonUp.attr('class', 'updateMap');
          var newButtonDown = $("<button value='" + i + "' class='btn btn-dark' id='btn-down-" + i + "'>" + i + "</button>");  
          newButtonDown.attr('class', 'updateMap');
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
       
        $(".updateMap").on("click", function(){
          clearMarkers()
          $("#map").removeClass('mapHidden');
          //$("#map").attr('class', 'mapDisplayed')
          console.log("oooooooverrrr")
        })
        
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
        //console.log("this latlng=");
        //console.log(thisAddress);
        var thisID = newShell.attr('id');
        var thisEventName = newShell.attr('data-name');
        geocodeAddress(thisAddress, geocoder, map, thisID, thisEventName);

        var newInside = $("<div id='" + i + "-inner' class='result-interior collapse'></div>");
        var linebreak = $("<br>");
        
        $("#results-page").append(newShell);
        newShell.append(newInside);
        $("#results-page").append(linebreak);
        enableButtons(numButtons);
      }
    });
  }

  // Function that handles hiding and displaying page buttons when a results page is chosen
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

  // Function that handles disabling all buttons on the page while loading new event data.
  // That way, the user cannot spam the submit or pagination buttons and queue up lots of queries
  function disableButtons(totalButtons) {
    for(var i = 0; i <= totalButtons; i++) {
      $('#btn-up-' + i).attr('disabled','disabled');
      $('#btn-down-' + i).attr('disabled','disabled');
    }
    $("#submit").attr("disabled", "disabled");
    $("#page-sub").attr("disabled", "disabled");
    $("#load").css("display", "block");
  }

  // Function that handles re-enabling buttons once event data has been loaded or after any kind of error.
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
  var database = firebase.database().ref().limitToLast(10);

  // CREATING A FIREBASE EVENT.
  
  database.on("child_added", function(snapshot) {
    //console.log(snapshot.val());
    
    // snapshot.ref().remove(); -------WANTING TO CLEAR THE FB DATA FOR A REFRESH START, BUT NOT WORKING

   var categoryPiece = snapshot.val().categoryName;
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