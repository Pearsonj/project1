//script for map
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

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
            "longitude": element.longitude
        };
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
        center: {
            lat: 47.502357,
            lng: -121.797867
        },
        zoom: 13,
        mapTypeId: 'terrain'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));


            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function (event) {
        addMarker(event.latLng);
    });

    // Adds a marker to the map and push to the array.
    function addMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });

        markers.push(marker);
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
}
// end map stuff

$('.dropdown-menu').hide();

$('.close').click(function () {
    $('.infoBox').animate({
        height: 'toggle'
    });

});