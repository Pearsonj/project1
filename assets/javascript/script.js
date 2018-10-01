//script for map
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// change history
// Date     By Description
// 2018-10-01 ERE - Add listener to markers 

// Initialize Firebase
//20181001jp
$('.infoBox').hide();
var config = {
    apiKey: "AIzaSyCzLac33ASAxf7qs23JEgp8cCib3Mf6DDo",
    authDomain: "hikingproject1.firebaseapp.com",
    databaseURL: "https://hikingproject1.firebaseio.com",
    projectId: "hikingproject1",
    storageBucket: "hikingproject1.appspot.com",
    messagingSenderId: "204744596898"
};
firebase.initializeApp(config);

var database = firebase.database();

$('#submit').on('click', function () {
    var name = $('.nameInput').val();
    var comment = $('#comment').val();

    // var nameDate = {
    //     name: name
    // };

    database.ref().push({
        name: name,
        comment: comment,
    });

    console.log(name);
    console.log(comment);
});

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let HikeObj = [];
let arrTrail = [];



// Build a query with latitude, longitude and max distance 
function buildQueryURL() {
    // var queryURL = "https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200361824-e97f84319ca562e9ed253ce31ddb2d4c";
    var queryURL = "https://www.hikingproject.com/data/get-trails?";
    let queryParms = {};

    queryParms.lat = "47.502357";
    queryParms.lon = "-121.797867";
    queryParms.maxDistance = "10";
    queryParms.key = "200361824-e97f84319ca562e9ed253ce31ddb2d4c";
    queryParms.maxResults = "20";
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParms));

    return queryURL + $.param(queryParms);

}

function getTrailsbyLocation(HikeData) {
    console.log(HikeData);
    console.log(HikeData.trails);
    console.log(HikeData.trails.length);
    for (x in HikeData.trail) {
        const element = HikeData.trail[x];
        console.log("for In: ", element.longitude + ":" + element.latitude);
        // object.keys(element).array.forEach(element1 => {
        console.log("Trail key: value --", element1 + " : " + element[element1]);
        // });
    }

    for (let i = 0; i < HikeData.trails.length; i++) {
        const element = HikeData.trails[i];
        console.log("for Loop: ", element.longitude + ":" + element.latitude);
        // let keyName = Object.keys(element)
        // console.log(Object.keys(element));
        let trail = {
            "name": element.name,
            "latitude": element.latitude,
            "longitude": element.longitude,
            "image": element.imgMedium,
            "rating": element.stars,
            "difficulty": element.difficulty,
            "summary": element.summary,
            "conditions": element.conditionStatus,
            "ascent": element.ascent,
            "location": element.location,
            "length": element.length


        };
        // database.ref().push({

        // });
        arrTrail.push(trail);

        // This works: iterate through the object properties, values =>
        // for (const x in element) {
        //     if (element.hasOwnProperty(x)) {
        //         const element2 = element[x];
        //         console.log("for in: Object", x + ":" + element2);
        //     }
        // }

        // This also works, 
        // Object.keys(element).forEach(function(key) {
        //     console.log("forEach: ", key, element[key]);
        // });
    }
    console.log("arrTrails: ", arrTrail);
    // for (let i = 0; i < arrTrail.length; i++) {
    //     const element = arrTrail[i];

    //     const tableRow = $("<tr>").attr("scope", "row");
    //     const tableCell = $("<td>").text(element.name);
    //     tableRow.append(tableCell);
    //     let tableCell2 = $("<td>").text(element.latitude);
    //     tableRow.append(tableCell2);
    //     let tableCell3 = $("<td>").text(element.longitude);
    //     tableRow.append(tableCell3);
    //     $("#tbody").append(tableRow);
    // }

    database.ref().update({
        trails: arrTrail
    });
}


function getTrailsByID(HikingData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves


    // Log the NYTData to console, where it will show up as an object
    console.log("71 HikingData: ", HikingData);
    console.log("------------------------------------");
    // let HikeData = JSON.parse(JSON.stringify(HikingData));
    for (x in HikingData) {
        const element = HikingData[x];
        if ((typeof element.name) !== "undefined") {
            console.log("name: ", element.name);
            console.log(element.conditionColor);
            console.log(element.conditionDetails);
            console.log(element.conditionStatus);
            console.log(element.conditionImg);
            console.log(element.id);
            console.log(element.conditionDate);
            console.log("------------------------------------");
        }

    }

    console.log(HikingData[0]);
    // console.log(HikingData.doc[0]);
    // console.log(HikingData.response.doc[0]);
}


//  Call this function on Marker Click Events //20181001ERE
// function markerOnClick() {
//     console.log(this.name.val());

//     // console.log("158 title; ", this[i]);

//     // map.setZoom(11);
//     // map.setCenter(marker.getPosition());

// }

// this is getTrailsByID
// Make the AJAX request to the API - GETs the JSON data at the queryURL.
// The data then gets passed as an argument to the getTrailsByID function
// $.ajax({
//     url: "https://www.hikingproject.com/data/get-conditions?ids=7001635,7002742,7000108,7002175,7005207&key=200361824-e97f84319ca562e9ed253ce31ddb2d4c",
//     //url: queryURL,
//     method: "GET"
// }).then(getTrailsByID);

let myURL = buildQueryURL();
console.log("myURL", myURL);
$.ajax({
    url: myURL,
    method: "GET"
}).then(getTrailsbyLocation);


function initAutocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {
            lat: 47.502357,
            lng: -121.797867
        },
        mapTypeId: 'terrain'
    });

    var marker = new google.maps.Marker({

        position: {
            lat: 47.502357,
            lng: -121.797867
        },
        map: map,
        title: 'Hello World!'
    });


    function mapMarkers() {



        database.ref().once("value", function (snapshot) {
            console.log('snapshot ' + snapshot.val().trails[0].name + snapshot.val().trails[0].longitude);

            var trailInfo = snapshot.child('trails')
            // .forEach(function(childSnapshot){
            //     // console.log(childSnapshot.val());
            //     return childSnapshot.val();
            console.log(trailInfo.val());
            var icon = {
                url: 'assets/images/pic.png',
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            }


            var markers = [];

            trailInfo.forEach(element => {
                var position = new google.maps.LatLng(element.val().latitude, element.val().longitude);
                console.log('lng ' + element.val().longitude);
                console.log('lat ' + element.val().latitude);
                console.log(position);

                //20181001ERE
                //  add costant named marker - create the marker 
                const marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: element.val().name,
                    position: position
                });



                //20181001ERE



                marker.addListener('click', function () {
                    console.log(element.val().name);
                    console.log(element.val());
                    $('.infoBox').animate({
                        height: 'show'
                    });
                    $('#trailName').html(element.val().name);
                    $('#image').attr('src', element.val().image);
                    $('#rating').html(element.val().rating);
                    $('#summary').html(element.val().summary);
                    $('#condition').html(element.val().conditions);
                    $('#ascent').html(element.val().ascent + "ft");
                    $('#location').html(element.val().location);
                    $('#length').html(element.val().length + "miles");
                });


                // markers.push(new google.maps.Marker({
                //     map: map,
                //     icon: icon,
                //     title: element.val().name,
                //     position: position
                // }));

                console.log(element.val());
            });

        });
        // });
    }
    mapMarkers();
}











// function initAutocomplete() {
//     var map = new google.maps.Map(document.getElementById('map'), {
//         center: {
//             lat: 47.502357,
//             lng: -121.797867
//         },
//         zoom: 13,
//         mapTypeId: 'terrain'
//     });

//     // Create the search box and link it to the UI element.
//     var input = document.getElementById('pac-input');
//     var searchBox = new google.maps.places.SearchBox(input);
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

//     // Bias the SearchBox results towards current map's viewport.
//     map.addListener('bounds_changed', function () {
//         searchBox.setBounds(map.getBounds());
//     });



//add markers 


// function initAutocomplete() {
// $.(map).on('click', function() => {
//     markers.push(this.marker);
//     database.set(
//         //overwrite or add to old information
//     )
//     database.ref(
//         //new information on page

//     )
//     // })
//     var markers = [];

//     var map = new google.maps.Map(document.getElementById('map'), {
//         center: {lat: 47.4947, lng: -121.7847},
//         zoom: 13,
//         mapTypeId: 'terrain'
//     });

//     // Search for North Bend Hikes.
//     var request = {
//         location: map.getCenter(),
//         radius: '50',
//         query: 'North Bend, WA Hikes'
//     };

//     var service = new google.maps.places.PlacesService(map);
//     service.textSearch(request, callback);

//     // Checks that the PlacesServiceStatus is OK, and adds a marker
//     // using the place ID and location from the PlacesService.
//     function callback(results, status) {
//         console.log(results);
//         console.log(results[0].name);
//         //---------------
//         var bounds = new google.maps.LatLngBounds();
//         results.forEach(function(place) {
//             console.log(place);
//             if (!place.geometry) {
//             console.log("Returned place contains no geometry");
//             return;
//             }
//             var icon = {
//                 // url: "images/noun_Buffalo Skull.png",
//             // url: "images/noun_Map Marker_HappyFace.png",
//             url: place.icon,

//             size: new google.maps.Size(71, 71),
//             size: new google.maps.Size(71, 71),
//             origin: new google.maps.Point(0, 0),

//             anchor: new google.maps.Point(17, 34),
//             scaledSize: new google.maps.Size(35, 35) // This is a good size for Skull and happy face
//             // scaledSize: new google.maps.Size(25, 25)
//             };

//             // Create a marker for each place.
//             markers.push(new google.maps.Marker({
//             map: map,
//             icon: icon,
//             title: place.name,
//             position: place.geometry.location
//             }));


//             if (place.geometry.viewport) {
//             // Only geocodes have viewport.
//             bounds.union(place.geometry.viewport);
//             } else {
//             bounds.extend(place.geometry.location);
//             }
//         });
//         map.fitBounds(bounds);

//         //---------------


//         if (status == google.maps.places.PlacesServiceStatus.OK) {
//             var marker = new google.maps.Marker({
//                 map: map,
//                 place: {
//                     placeId: results[0].place_id,
//                     location: results[0].geometry.location
//                 }
//             });
//         }
//     }

// // Create the search box and link it to the UI element.
// var input = document.getElementById('pac-input');
// var searchBox = new google.maps.places.SearchBox(input);
// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

// // Bias the SearchBox results towards current map's viewport.
// map.addListener('bounds_changed', function() {
// searchBox.setBounds(map.getBounds());
// });

// // Listen for the event fired when the user selects a prediction and retrieve
// // more details for that place.
// searchBox.addListener('places_changed', function() {
// var places = searchBox.getPlaces();

// if (places.length == 0) {
// return;
// }

// // Clear out the old markers.
// markers.forEach(function(marker) {
// marker.setMap(null);
// });
// markers = [];

// // For each place, get the icon, name and location.
// var bounds = new google.maps.LatLngBounds();
// places.forEach(function(place) {
// console.log(place);
// if (!place.geometry) {
//   console.log("Returned place contains no geometry");
//   return;
// }




// var icon = {
//   url: place.icon,
//   size: new google.maps.Size(71, 71),
//   origin: new google.maps.Point(0, 0),
//   anchor: new google.maps.Point(17, 34),
//   scaledSize: new google.maps.Size(25, 25)
// };

// database.ref().once('value', function(snapshot){
//     console.log("snapshot" + snapshot);
// });



// // Create a marker for each place.
// markers.push(new google.maps.Marker({
//   map: map,
//   icon: icon,
//   title: place.name,
//   position: place.geometry.location
// }));


// if (place.geometry.viewport) {
//   // Only geocodes have viewport.
//   bounds.union(place.geometry.viewport);
// } else {
//   bounds.extend(place.geometry.location);
// }
// });
// map.fitBounds(bounds);
// });

// // This event listener will call addMarker() when the map is clicked.
// map.addListener('click', function(event) {
// addMarker(event.latLng);
// console.log("173 event.latLng:", event.latLng);
// console.log("173 event.latLng.lat():", event.latLng.lat());
// console.log("173 event.latLng.lng():", event.latLng.lng());
// });

// // Adds a marker to the map and push to the array.
// function addMarker(location) {
// console.log("180: location:",location);
// var marker = new google.maps.Marker({
// position: location,
// map: map
// }); 

// markers.push(marker);
// }

// // Sets the map on all markers in the array.
// function setMapOnAll(map) {
// for (var i = 0; i < markers.length; i++) {
// markers[i].setMap(map);
// }
// }

// // Removes the markers from the map, but keeps them in the array.
// function clearMarkers() {
// setMapOnAll(null);
// }

// // Shows any markers currently in the array.
// function showMarkers() {
// setMapOnAll(map);
// }

// // Deletes all markers in the array by removing references to them.
// function deleteMarkers() {
// clearMarkers();
// markers = [];
// }



// }






// //   function addSomePins(){


// //   }















//     var markers = [];
//     // Listen for the event fired when the user selects a prediction and retrieve
//     // more details for that place.
//     searchBox.addListener('places_changed', function () {
//         var places = searchBox.getPlaces();

//         if (places.length == 0) {
//             return;
//         }

//         // Clear out the old markers.
//         markers.forEach(function (marker) {
//             marker.setMap(null);
//         });
//         markers = [];

//         // For each place, get the icon, name and location.
//         var bounds = new google.maps.LatLngBounds();
//         places.forEach(function (place) {
//             if (!place.geometry) {
//                 console.log("Returned place contains no geometry");
//                 return;
//             }
//             var icon = {
//                 url: place.icon,
//                 size: new google.maps.Size(71, 71),
//                 origin: new google.maps.Point(0, 0),
//                 anchor: new google.maps.Point(17, 34),
//                 scaledSize: new google.maps.Size(25, 25)
//             };

//             // Create a marker for each place.
//             markers.push(new google.maps.Marker({
//                 map: map,
//                 icon: icon,
//                 title: place.name,
//                 position: place.geometry.location
//             }));


//             if (place.geometry.viewport) {
//                 // Only geocodes have viewport.
//                 bounds.union(place.geometry.viewport);
//             } else {
//                 bounds.extend(place.geometry.location);
//             }
//         });
//         map.fitBounds(bounds);
//     });

//     // This event listener will call addMarker() when the map is clicked.
//     map.addListener('click', function (event) {
//         addMarker(event.latLng);
//     });

//     // Adds a marker to the map and push to the array.
//     function addMarker(location) {
//         var marker = new google.maps.Marker({
//             position: location,
//             map: map
//         });

//         markers.push(marker);
//     }

//     // Sets the map on all markers in the array.
//     function setMapOnAll(map) {
//         for (var i = 0; i < markers.length; i++) {
//             markers[i].setMap(map);
//         }
//     }

//     // Removes the markers from the map, but keeps them in the array.
//     function clearMarkers() {
//         setMapOnAll(null);
//     }

//     // Shows any markers currently in the array.
//     function showMarkers() {
//         setMapOnAll(map);
//     }

//     // Deletes all markers in the array by removing references to them.
//     function deleteMarkers() {
//         clearMarkers();
//         markers = [];
//     }
// }
// // end map stuff

$('.dropdown-menu').hide();

$('.close').click(function () {
    $('.infoBox').animate({
        height: 'toggle'
    });

});