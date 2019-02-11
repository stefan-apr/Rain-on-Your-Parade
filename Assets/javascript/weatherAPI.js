// weather results div default is collapsed

$("#results-page").on("click", ".result-shell", function(event) {
    event.preventDefault();
    console.log("clicked on a specific event");
    
    if ($(this).children(".result-interior").hasClass("collapse")) {   // the .next("div") is the div that actually contains weather data 
        console.log("show weather");
        var lat = $(this).attr("data-latitude"); // pulled from eventbrite API
        var long = $(this).attr("data-longitude");// pulled from eventbrite API
        var eventDate = moment($(this).attr("data-start")).format("X"); // pulled from eventbrite API, convert to UNIX format
        var queryURL = "https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/" + lat + "," + long + "," + eventDate;
        var queryURL;
        var wxresults; 
        var wxdisplay = $("div");

        var proxy = "https://cors-anywhere.herokuapp.com/";
    
        $.ajax({
            url: proxy + queryURL,
            method: "GET"
        })
            .then(function(response) {
                wxresults = response.daily.data[0];
                console.log(wxresults);
                console.log(queryURL);

                var icon = wxresults.icon;
                var summary = wxresults.summary;
                var rain = wxresults.precipProbability;
                var high = wxresults.temperatureHigh;
                var low = wxresults.temperatureLow;
                var humid = wxresults.humidity;
                var wind = wxresults.windSpeed;
                var cloud = wxresults.cloudCover;                   
                
                wxdisplay.append("<canvas id='" + icon + "' height='64' width='64'></canvas> " + summary +
                    "<br>High temperature: " + high +
                    "\xB0F<br>Low temperature: " + low +
                    "\xB0F<br>Rain: " + rain +
                    "<br>Humidity: " + humid +
                    "<br>Wind speed: " + wind +
                    "mph<br>Cloud cover: " + cloud +
                    "<br>");
                
                $(this).children(".result-interior").append(wxdisplay);
            })
            $(this).children(".result-interior").attr("class", "collapse-show");  // shows the div once it's populated with weather data
            
        }

    else if ($(this).children(".result-interior").hasClass("collapse-show")) {  // collapse div if it's already showing
        $(this).next(".result-interior").attr("class", "collapse");
        console.log("hide weather");
    }
    else {
        console.log("error");
    }
});