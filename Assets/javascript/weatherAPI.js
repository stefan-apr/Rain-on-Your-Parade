// weather results div default is collapsed

$(document).on("click", ".result-shell", function(event) {
    event.preventDefault();
    console.log("clicked on a specific event");
    
    if ($("this").next("div").hasClass("collapse")) {   // the .next("div") is the div that actually contains weather data 
        var lat = $(this).attr("data-latitude"); // pulled from eventbrite API
        var long = $(this).attr("data-longitude");// pulled from eventbrite API
        var eventDate = moment($(this).attr("data-start")).format("x"); // pulled from eventbrite API, convert to UNIX format
        var queryURL = "https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/" + lat + "," + long + "," + eventDate;
        var queryURL;
        var wxresults; 
        var wxdisplay = $("div");
    
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                wxresults = response.data;
                console.log(wxresults);

                var icon = $("canvas").attr("id", wxresults.daily.data[i].icon);
                var date = moment(wxresults.daily.data[i].time, "x").format("dd/mm/yy");
                var summary = wxresults.daily.data[i].summary;
                var rain = wxresults.daily.data[i].precipProbability;
                var high = wxresults.daily.data[i].temperatureHigh;
                var low = wxresults.daily.data[i].temperatureLow;
                var humid = wxresults.daily.data[i].humidity;
                var wind = wxresults.daily.data[i].windSpeed;
                var cloud = wxresults.daily.data[i].cloudCover;                   
                
                wxdisplay.append("<strong>" + date + "</strong><br>"
                    + icon + " " + summary +
                    "<br>High temperature: " + high +
                    "\xB0F<br>Low temperature: " + low +
                    "\xB0F<br>Rain: " + rain +
                    "<br>Humidity: " + humid +
                    "<br>Wind speed: " + wind +
                    "mph<br>Cloud cover: " + cloud +
                    "<br>");
                
                $("this").next("div").append(wxdisplay);
                $("this").next("div").attr("class", "collapse-show");  // shows the div once it's populated with weather data
                console.log("show weather");
            })
        }

    {  // collapse div if it's already showing
        $("this").next("div").attr("class", "collapse");
        console.log("hide weather");
    }
}
});