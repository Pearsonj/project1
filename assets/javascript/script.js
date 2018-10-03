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
    let hikeName1 = $("#trailName").text();

//20181003ERE - Push posts to firebase
    database.ref().child("posts/post").push({
        userName: name,
        timestamp: moment().format("YYYY-MM-DD HH:MM:SS").toString(),
        comment: comment,
        hikeName: hikeName1
    });

    console.log(name);
    console.log(comment);
});


let HikeObj = [];
let arrTrail = [];




function buildQueryURL() {

    var queryURL = "https://www.hikingproject.com/data/get-trails?";
    let queryParms = {};

    queryParms.lat = "47.502357";
    queryParms.lon = "-121.797867";
    queryParms.maxDistance = "200";
    queryParms.key = "200361824-e97f84319ca562e9ed253ce31ddb2d4c";
    queryParms.maxResults = "200";
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
        console.log("Trail key: value --", element1 + " : " + element[element1]);
    }

    for (let i = 0; i < HikeData.trails.length; i++) {
        const element = HikeData.trails[i];
        console.log("for Loop: ", element.longitude + ":" + element.latitude);
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

        arrTrail.push(trail);
    }
    console.log("arrTrails: ", arrTrail);

    database.ref().update({
        trails: arrTrail
    });
}


function getTrailsByID(HikingData) {

    console.log("71 HikingData: ", HikingData);
    console.log("------------------------------------");

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

}


let myURL = buildQueryURL();
console.log("myURL", myURL);
$.ajax({
    url: myURL,
    method: "GET"
}).then(getTrailsbyLocation);


function initAutocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: {
            lat: 47.608013,
            lng:  -122.335167
        },
        mapTypeId: 'terrain'
    });

    


    function mapMarkers() {



        database.ref().once("value", function (snapshot) {
            console.log('snapshot ' + snapshot.val().trails[0].name + snapshot.val().trails[0].longitude);

            var trailInfo = snapshot.child('trails')

            console.log(trailInfo.val());

            var markers = [];

            trailInfo.forEach(element => {
                var position = new google.maps.LatLng(element.val().latitude, element.val().longitude);
                console.log('lng ' + element.val().longitude);
                console.log('lat ' + element.val().latitude);
                console.log(position);

                switch (element.val().difficulty) {
                    case "green":
                    case "greenBlue":

                        var icon = {
                            url: 'assets/images/pic8.gif',
                            size: new google.maps.Size(75, 75),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 35),
                            scaledSize: new google.maps.Size(55, 55)
                        }

                        break;

                    case "blue":
                    case "blueBlack":

                        var icon = {
                            url: 'assets/images/pic9.gif',
                            size: new google.maps.Size(75, 75),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 35),
                            scaledSize: new google.maps.Size(55, 55)
                        }

                        break;

                    case "black":
                    case "dblack":

                        var icon = {
                            url: 'assets/images/pic4.gif',
                            size: new google.maps.Size(75, 75),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(20, 35),
                            scaledSize: new google.maps.Size(55, 55)
                        }
                        break;
                }
                const marker = new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: element.val().name,
                    position: position
                });

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

                    // let arrPosts =database.ref("posts/post").orderByChild("name").equalTo(element.val().name);
                    // console.log(arrPosts);
                    // console.log(arrPosts.val());
                    let trlName = element.val().name;
                    console.log("222 TrailName: ", element.val().name);
                    
                    let myRef = database.ref("posts");

                    $("#tableBodyComments").empty();
                    myRef.child("post").once("value", function(imageSnap) {
                        imageSnap.forEach(function(child){
                            console.log("228 child.val():",  child.val());
                            if (child.val().hikeName === trlName) {
                                const commentTR = $("<tr>");
                                const userNameTD = $("<td>").text(child.val().userName);
                                const commentTD = $("<td>").text(child.val().comment);
                                commentTR.append(userNameTD);
                                commentTR.append(commentTD);
                                $("#tableBodyComments").append(commentTR);
                            }
                            
                        });
                    });

                    // myRef.child("post").orderByChild('name').equalTo(element.val().name).once("value", function(imageSnap) {
                    //     imageSnap.forEach(function(child){
                    //         console.log("228 child.val():",  child.val());
                    //     });
                    // });
                    // database.ref("posts/post").orderByChild('name').equalTo(element.val().name).once('value', function(imageSnap){
                    //     imageSnap.forEach(function(child) {
                    //         console.log("225: ", child.val().name);
                    //     //   var image = child.child('url').val();
                    //     //   leftImg.src=image; 
                    //     })
                    //  });

                });
                console.log(element.val());
            });

        });

    }
    mapMarkers();
}

$('.dropdown-menu').hide();

$('.close').click(function () {
    $('.infoBox').animate({
        height: 'toggle'
    });

});