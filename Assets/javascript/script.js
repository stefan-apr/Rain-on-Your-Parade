// Initialize Firebase
var config = {
  apiKey: "AIzaSyCdr3ogLmQPzltt7gQ7f2oX1gukqGmO7Tc",
  authDomain: "rainingonyourparade.firebaseapp.com",
  databaseURL: "https://rainingonyourparade.firebaseio.com",
  projectId: "rainingonyourparade",
  storageBucket: "rainingonyourparade.appspot.com",
  messagingSenderId: "852639680516"
};
firebase.initializeApp(config);


// WEATHER API

$(/*SEARCH RESULTS CLICKS*/).on("click", function(event) {
  var lat = ; //
  var long = ;//
  var time = ; //for historical data
  var URL = "https://api.darksky.net/forecast/e3bf810172b3fa7c6960cc8b6769743c/";
  var queryURL;
  var wxresults;

  event.preventDefault();
  if (/* Event date <= 7 days */) {
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

      })

  }
)