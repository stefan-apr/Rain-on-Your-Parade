// WEATHER API

$(document).on("click", ".result-shell", function(event) {
    event.preventDefault();
    var that = $(this); 
    
    if (($(this).children().hasClass("collapse")) && ($.trim($(this).children().html()).length === 0)) {   // the .children() is the div that actually contains weather data, starts out collapsed by default
        console.log("call and show weather");

        var lat = $(this).attr("data-latitude"); // pulled from eventbrite API
        var long = $(this).attr("data-longitude");// pulled from eventbrite API
        var eventDate = moment($(this).attr("data-start")).format("X"); // pulled from eventbrite API, convert to UNIX format
        var eventMoment = moment($(this).attr("data-start"));
        var now = new moment();
        var wxresults; 
        var proxy = "https://cors-anywhere.herokuapp.com/";
        var queryURL = "https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/" + lat + "," + long + "," + eventDate;
    
        $.ajax({
            url: proxy + queryURL,
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
                
                wxdisplay.append("<canvas id='" + icon + "' height='64' width='64'></canvas> " + summary +
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
                for(i = list.length; i--; )
                    icons.set(list[i], list[i]);
                icons.play();

            })
            $(this).children().removeClass("collapse").addClass("collapse-show");  // shows the div once it's populated with weather data
            
        }
    
    else if (($(this).children().hasClass("collapse")) && ($.trim($(this).children().html()).length != 0)) {
        console.log("weather already loaded, just show it");
        $(this).children().removeClass("collapse").addClass("collapse-show");
    }

    else if ($(this).children().hasClass("collapse-show")) {  // collapse div if it's already showing
        $(this).children().removeClass("collapse-show").addClass("collapse");
        console.log("hide weather");
    }
    else {
        console.log("error");
    }
});