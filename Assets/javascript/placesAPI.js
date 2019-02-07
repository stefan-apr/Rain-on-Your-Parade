apiKey = "AIzaSyAQtNCDpVA6bXIzMTuaWcTSYw2yIWRPHww"



var selectedLocationID;
var coordinates = {};

$("#event-location").keyup(function(){
    $("#showPredictions").empty();
    var locationInput = $(this).val();
    console.log($(this).val());
    
    var autoLocationUrl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" 
                            + locationInput + "&types=(cities)&key=" + apiKey;
    console.log(autoLocationUrl);   

    $.ajax({
        url : autoLocationUrl,
        method : 'GET'
    }).then(function(autoLocationResponse){
        autoLocationResponse.predictions.forEach(function(locationPrediction){
            var predictionLink = $("<button>", {
                'data-placeId' : locationPrediction.place_id,
                'text' : locationPrediction.description,
                'class' : 'predictionButtons'
            })
            console.log(predictionLink);
            $("#showPredictions").append(predictionLink);
        })
    })
})

$(document).on("click", ".predictionButtons", function(event){
    event.preventDefault();
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
})











// https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJRdmfADq_woARYaVhnfQSUTI&key=AIzaSyAQtNCDpVA6bXIzMTuaWcTSYw2yIWRPHww




//"https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + "" + "&types=(cities)&key=apiKey";
