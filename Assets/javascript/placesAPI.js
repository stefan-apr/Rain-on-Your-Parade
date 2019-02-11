apiKey = "AIzaSyAQtNCDpVA6bXIzMTuaWcTSYw2yIWRPHww"



var selectedLocationID;
var coordinates = {};

$("#locationInput").keyup(function(){
    $(".predictionButtons").remove();
    var locationInput = $(this).val();
    //console.log($(this).val());
    
    var autoLocationUrl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" 
                            + locationInput + "&types=(cities)&key=" + apiKey;
    console.log(autoLocationUrl);   

    $.ajax({
        url : autoLocationUrl,
        method : 'GET'
    }).then(function(autoLocationResponse){
        autoLocationResponse.predictions.forEach(function(locationPrediction){
            var predictionLink = $("<div>");
            predictionLink.attr('data-placeId', locationPrediction.place_id);
            predictionLink.attr('class', 'predictionButtons');
            predictionLink.text(locationPrediction.description);  
            //console.log(predictionLink);
            $(".autoComplete").append(predictionLink[0]);
            //console.log(predictionLink[0]);

        })
    })
})

$(document).on("click", ".predictionButtons", function(event){

    //console.log($(this).attr('data-placeId'));
    selectedLocationID = $(this).attr('data-placeId');
    coordinateUrl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=" 
                    + selectedLocationID + "&key=" + apiKey;
    //console.log(coordinateUrl);
    $.ajax({
        url : coordinateUrl,
        method : 'GET'
    }).then(function(selectedCoordinate){
        //console.log(selectedCoordinate.result.geometry.location);
        coordinates = selectedCoordinate.result.geometry.location;
        console.log(coordinates);
    })
    document.getElementById("locationInput").value = $(this).text();
    
    
    $(".predictionButtons").remove();

    return false
})


