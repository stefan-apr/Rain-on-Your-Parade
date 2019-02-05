// default is collapsed

$(".result-shell").on("click", function(event) {
    event.preventDefault();
    
    // if ($("this").next("div").hasClass("collapse")) {
    
        var lat = $(this).attr("data-latitude"); // pulled from eventbrite API
        var long = $(this).attr("data-longitude");// pulled from eventbrite API
        var eventDate = moment($(this).attr("data-start"));
        var today = moment();
        var URL = "https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/";
        var queryURL;
        var wxresults; 
        var wxdisplay = $("div");
        var eventDate;  
    
        if (eventDate.diff(today, "days") <= 7) {
            queryURL = URL + lat + "," + long;
        }
        else { /* Event date > 7 days away*/
            queryURL = URL + lat + "," + long + "," + time;
        }
    
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function(response) {
                wxresults = response.data;
                console.log(queryURL);
                console.log(wxresults);
                for (var i=0; i<8; 1++) {
                    //var icon = wxresults.daily.data[i].icon; //
                    var summary = wxresults.daily.data[i].summary;
                    var rain = wxresults.daily.data[i].precipProbability;
                    var high = wxresults.daily.data[i].temperatureHigh;
                    var low = wxresults.daily.data[i].temperatureLow;
                    var humid = wxresults.daily.data[i].humidity;
                    var wind = wxresults.daily.data[i].windSpeed;
                    var cloud = wxresults.daily.data[i].cloudCover;
                    wxdisplay.append(summary + "<br>Rain: " + rain + "<br>High: " + high + "F<br>Low: " + low + "F<br>Humidity: " + humid + "<br>Wind speed: " + wind + "mph<br>Cloud cover: " + cloud + "<br>");
                }
                $("this").append(wxdisplay);
                $("this").attr("class", "collapse-show");
            })

    /*
    else {
        // collapse div
        $("this").attr("class", "collapse");
    }
    */
    }
})