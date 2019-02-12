// WEATHER API

$(document).on("click", ".result-shell", function(event) {
    event.preventDefault();
    var that = $(this); 
    
    // the .children() is the div that actually contains weather data, starts out collapsed and empty by default
    if (($(this).children(".result-interior").hasClass("collapse")) && ($.trim($(this).children(".result-interior").html()).length === 0)) {

        var lat = $(this).attr("data-latitude"); // pulled from eventbrite API
        var long = $(this).attr("data-longitude");// pulled from eventbrite API
        var eventMoment = moment($(this).attr("data-start")); // pulled from eventbrite API
        var eventDate = eventMoment.format("X"); // convert to UNIX format
        var now = new moment();
        var wxresults; 
        var queryURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/" + lat + "," + long + "," + eventDate;
    
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                wxresults = response.daily.data[0];

                var wxdisplay = $("<div/>");
                var icon = wxresults.icon;
                var summary = wxresults.summary;
                var precipProb = wxresults.precipProbability;
                var precipType = wxresults.precipType;
                var high = wxresults.temperatureHigh;
                var low = wxresults.temperatureLow;
                var humid = wxresults.humidity;
                var wind = wxresults.windSpeed;
                var cloud = wxresults.cloudCover;
                
                wxdisplay.append("<canvas class='" + icon + "' height='64' width='64'></canvas> " + summary +
                    "<br>High temperature: " + high +
                    "\xB0F<br>Low temperature: " + low +
                    "\xB0F<br>Probability of precipitation: " + precipProb +
                    "<br>Type of precipication: " + precipType +
                    "<br>Humidity: " + humid +
                    "<br>Wind speed: " + wind +
                    "mph<br>Cloud cover: " + cloud +
                    "<br>");

                if (eventMoment.diff(now, "days") > 7) {
                    wxdisplay.prepend("<p style='color:red;'>This event is more than a week away, so this is historical weather data:</p>");
                }
                
                that.children(".result-interior").html(wxdisplay);

                var icons = new Skycons(),
                list  = [
                    "clear-day", "clear-night", "partly-cloudy-day",
                    "partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind",
                    "fog"
                ],
                i;
                for(i = list.length; i--; ) {
                    var weatherType = list[i],
                        elements = document.getElementsByClassName( weatherType );
                    for (e = elements.length; e--;){
                        icons.set( elements[e], weatherType );
                    }
                }
                icons.play();

            })
            $(this).children(".result-interior").removeClass("collapse").addClass("collapse-show");  // shows the div once it's populated with weather data
            
        }
    
    else if (($(this).children(".result-interior").hasClass("collapse")) && ($.trim($(this).children(".result-interior").html()).length != 0)) { // weather data already loaded, just show it
        $(this).children(".result-interior").removeClass("collapse").addClass("collapse-show");
    }

    else if ($(this).children(".result-interior").hasClass("collapse-show")) {  // collapse div on click if it's already showing
        $(this).children(".result-interior").removeClass("collapse-show").addClass("collapse");
    }
    else {
        console.log("error");
    }
});