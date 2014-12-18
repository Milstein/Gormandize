// global map variable
var map;
var markers = new Array();
window.onload = function() {


  var default_latitude = 37.7733;
  var default_longitude = -122.4367;

  map = L.map('map').setView([default_latitude, default_longitude], 12);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var singleMarker = new L.marker([default_latitude, default_longitude]).addTo(map)
    .bindPopup('<strong>San Francisco</strong><br>Gormandize Example.')
    .openPopup();

  markers.push(singleMarker);
  map.addLayer(markers[0]);
};

$(document).ready(function() {
  $('#yelp_table_results').hide();
  $('#fs_table_results').hide();
  $('#yelp_heading').hide();
  $('#fs_heading').hide();
  $('.get_photos').hide();
});

$("#search_yelp").click(function() {

  var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey: $('#get_yelp_consumer_key').val(),
    consumerSecret: $('#get_yelp_consumer_secret').val(),
    accessToken: $('#get_yelp_token').val(),
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret: $('#get_yelp_token_secret').val(),
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };


  var terms = $('#yelpsearchterm').val();
  var near = $('#yelpaddress').val();;

  if (terms == '' || near == '') {
    // validate terms search
    $('#yelp_results').html("<h4 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h4>");
  } else {
    $('#tagline').hide();
    // show table, swap button for loading spinner
    $('#yelp_heading').show();
    $('#yelp_table_results').show();
    $('#search_yelp').hide();
    $('#loading-indicator').show();
  }

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['term', terms]);
  parameters.push(['location', near]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action': 'http://api.yelp.com/v2/search',
    'method': 'GET',
    'parameters': parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  console.log(parameterMap);

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      console.log(data);

      // show button again after loading is done
      $('#loading-indicator').hide();
      $('#search_yelp').show();

      // empty yelp results before a new search is done
      $('#yelp_results').empty();
      $('#yelp_image_results').empty();
      $('#yelp_table_results table > tbody').html("");

      // empty markers from map before a new search is done
      for (var j = 0; j < markers.length; j++) {
        map.removeLayer(markers[j]);
      }

      // display top 20 business results on map and in table
      for (var i = 0; i < data.businesses.length; i++) {
        // display restaurant search results (name, link-to Yelp page, phone number, and photo(s))
        $('#yelp_table_results table > tbody').append('<tr><td>' + (i + 1) + ".) " + "<a href=" + data.businesses[i].url + ">" + data.businesses[i].name + '</a></td>' + '<td>' + data.businesses[i].location.address + '</td>' + '<td>' + data.businesses[i].display_phone + '</td>' + '<td>' + '<img src=' +
          data.businesses[i].image_url + ' />' + '</td></tr>');

        var first_latitude = data.businesses[0].location.coordinate.latitude;
        var first_longitude = data.businesses[0].location.coordinate.longitude;

        var new_latitude = data.businesses[i].location.coordinate.latitude;
        var new_longitude = data.businesses[i].location.coordinate.longitude;

        // set first marker with popup
        var singleMarker = new L.marker([first_latitude, first_longitude]).addTo(map)
          .bindPopup('<strong>' + data.businesses[0].name + '</strong><br>' + data.businesses[0].location.address)
          .openPopup();

        markers.push(singleMarker);
        // make rest of markers
        singleMarker = new L.marker([new_latitude, new_longitude]).addTo(map)
          .bindPopup('<strong>' + data.businesses[i].name + '</strong><br>' + data.businesses[i].location.address);
        markers.push(singleMarker);
        map.addLayer(markers[i]);


        // toggle chart display
        // $('#chartContainer').hide();


        var chart = new CanvasJS.Chart("chartContainer", {
          backgroundColor: "#C6DEFF",
          title: {
            text: "Relational Graphics",
            fontFamily: "arial black",
            fontColor: "DarkSlateGrey"
          },
          axisX: {
            title: "rating",
            titleFontFamily: "arial black",
            titleFontSize: 12,
            interval: .5

          },
          axisY: {
            title: "number of reviews",
            titleFontFamily: "arial black",
            valueFormatString: false,
            titleFontSize: 12
          },
          data: [{
              type: "scatter",
              toolTipContent: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <br/> <strong>review count: </strong> {y} <br/> <strong>rating: </strong> {x} ",
              dataPoints: [

                {
                  x: data.businesses[0].rating,
                  y: data.businesses[0].review_count,
                  name: data.businesses[0].name
                }, {
                  x: data.businesses[1].rating,
                  y: data.businesses[1].review_count,
                  name: data.businesses[1].name
                }, {
                  x: data.businesses[2].rating,
                  y: data.businesses[2].review_count,
                  name: data.businesses[2].name
                }, {
                  x: data.businesses[3].rating,
                  y: data.businesses[3].review_count,
                  name: data.businesses[3].name
                }, {
                  x: data.businesses[4].rating,
                  y: data.businesses[4].review_count,
                  name: data.businesses[4].name
                }, {
                  x: data.businesses[5].rating,
                  y: data.businesses[5].review_count,
                  name: data.businesses[5].name
                }, {
                  x: data.businesses[6].rating,
                  y: data.businesses[6].review_count,
                  name: data.businesses[6].name
                }, {
                  x: data.businesses[7].rating,
                  y: data.businesses[7].review_count,
                  name: data.businesses[7].name
                }, {
                  x: data.businesses[8].rating,
                  y: data.businesses[8].review_count,
                  name: data.businesses[8].name
                }, {
                  x: data.businesses[9].rating,
                  y: data.businesses[9].review_count,
                  name: data.businesses[9].name
                }, {
                  x: data.businesses[10].rating,
                  y: data.businesses[10].review_count,
                  name: data.businesses[10].name
                },

              ]

            }

          ]

        });

        chart.render();
      }

      // reload map with first restaurant's coordinates
      map.setView(new L.LatLng(first_latitude, first_longitude), 15);
      map.panTo(new L.LatLng(first_latitude, first_longitude));
    }


  });

  // return false to make sure button doesn't submit form
  return false;
});


$("#search_foursquare").click(function() {
  var fs_photos = new Array();
  $('body').animate({
      scrollTop: $(".scroll_to_fs").offset().top - 150
    },
    'slow');

  var auth = {
    //
    // Update with your auth tokens.
    //
    clientID: $('#get_fs_client_id').val(),
    clientSecret: $('#get_fs_client_secret').val(),
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    apiVersion: $('#get_fs_api_version').val(),
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };


  var terms = $('#fssearchterm').val();
  var near = $('#fsaddress').val();;

  if (terms == '' || near == '') {
    // validate terms search
    $('#fs_results').html("<h4 class='loading'>Ha! We haven't forgotten to validate the form! Please enter something.</h4>");
  } else {
    $('#tagline').hide();
    // show table, swap button for loading spinner
    $('#fs_heading').show();
    $('#fs_table_results').show();
    $('#search_foursquare').hide();
    $('#loading-indicator2').show();
    $('.get_photos').show();
  }

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['query', terms]);
  parameters.push(['near', near]);
  parameters.push(['callback', 'cb']);
  parameters.push(['client_id', auth.clientID]);
  parameters.push(['client_secret', auth.clientSecret]);
  parameters.push(['v', auth.apiVersion]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action': 'https://api.foursquare.com/v2/venues/explore',
    'method': 'GET',
    'parameters': parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  console.log(parameterMap);

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
        console.log(data);
        var checkinsCount = [];
        var d;
        var venue_id = [];

        // show button again after loading is done
        $('#loading-indicator2').hide();
        $('#search_foursquare').show();

        // empty results first
        $('#fs_checkins_results').empty();
        $('#yelp_results').empty();
        $('#fs_table_results table > tbody').html("");

        var venueName, venueURL, venueLocation;
        // display top 20 business results
        for (var i = 0; i < data.response.groups[0].items.length; i++) {
          venueName = data.response.groups[0].items[i].venue.name;

          venueLocation = data.response.groups[0].items[i].venue.location.address;

          checkinsCount[i] = data.response.groups[0].items[i].venue.stats.checkinsCount + " ";
          venue_id[i] = data.response.groups[0].items[i].venue.id;

          // display restaurant search results
          venueURL = "https://foursquare.com/v/" + name.replace(/\s+/g, '-').toLowerCase() + "/" + venue_id[i];

          $('#fs_table_results table > tbody').append('<tr><td>' + (i + 1) + ".) " + "<a href=" +
            venueURL + ">" + venueName + '</a></td><td>' + checkinsCount[i] + '</td><td>' + venueLocation + '</td>');


        }

        $("#fs_images").data("venueIDs", venue_id);
        $("#fs_images").data("venueCount", data.response.groups[0].items.length);

      } // end AJAX success

  }); // end AJAX


  // return false to make sure button doesn't submit form
  return false;

}); // end entire function

// checkboxes will turn on data visualization
$('#checkbox1').click(function() {
  // validate data exists first before displaying data
  if ($.hasData($('#fs_checkins_results')[0])) {
    $("#fs_checkins_results").toggle(this.checked);
  } else {
    alert("You must enter a search query before viewing a data visualization.");
    $('#checkbox1').prop('checked', false);

  }
});

// checkboxes for Yelp Relational Graphic
$('#checkbox2').click(function() {
  // validate data exists first before displaying data
  if ($('#yelp_image_results').html()) {
    $("#chartContainer").toggle(this.checked);
  } else {
    alert("You must enter a search query before viewing a data visualization.");
    $('#checkbox2').prop('checked', false);

  }
});

// get photos for Foursquare results
$('#get_photos').click(function() {
  // validate data exists first before displaying data
  $('#fs_images').html("");

  var venue_ids = [];
  var venueCount = $("#fs_images").data("venueCount");

  // user chooses which venue result to get photos for (-1 is because venues are displayed starting at 0)
  var venueNumber = $("#get_photos_number").val() - 1;

  var venueID = $("#fs_images").data("venueIDs")[venueNumber];
  console.log(venueID);

  var auth = {
    //
    // Update with your auth tokens.
    //
    clientID: $('#get_fs_client_id').val(),
    clientSecret: $('#get_fs_client_secret').val(),
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    apiVersion: $('#get_fs_api_version').val(),
    serviceProvider: {
      signatureMethod: "HMAC-SHA1"
    }
  };

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['callback', 'cb']);
  parameters.push(['client_id', auth.clientID]);
  parameters.push(['client_secret', auth.clientSecret]);
  parameters.push(['v', auth.apiVersion]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
    'action': 'https://api.foursquare.com/v2/venues/' + venueID + '/photos',
    'method': 'GET',
    'parameters': parameters
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);
  console.log(parameterMap);

  // clear out fs_images each time image request is clicked

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      console.log(data);
      var photoURLs = [];

      if (data.response.photos.count > 0) {
        for (var i = 0; i < data.response.photos.count; i++) {


          photoURLs[i] = data.response.photos.items[i].prefix + '150x150' + data.response.photos.items[i].suffix;
          console.log(photoURLs[i]);

          $('#fs_images').append('<img src=' +
            photoURLs[i] + ' />');

          // $('#fs_table_results table > tbody tr:first td:last').append('<img src=' +  
          // photoURLs[i]
          // + ' />');
        }
      } else {
        $('#fs_images').html("<h4 class='loading'>Rats! No images could be found for that venue. Perhaps it's a new venue?</h4>");
      }
    }
  });

});