// Adds the event listeners for the buttons
var buttons = document.getElementsByClassName("dirButton");
for (var c = 0; c < buttons.length; c++) {
    buttons[c].addEventListener("click", function(event) {
        directions(event);
    });
}

// Gets the user directions
function directions(event) {
    // Stops the page refreshing and pulls the button
    event.preventDefault();
    button = event.target;

    // Makes the AJAX request
    req = new XMLHttpRequest();
    var address = "/get-address?id=" + button.value;
    req.open("GET", address, true);
    req.addEventListener("load", function (){
        // Gets the address
        var address = req.response;
        console.log("Input Address: " + address);
        calculateAndDisplayRoute(directionsService, directionsDisplay, address);
    });
    req.send();
}

// Generates the defualt map
var directionsService;
var directionsDisplay;
var map;
function initMap() {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 47.58, lng: -122.34}
    });
    directionsDisplay.setMap(map);
}

// Makes the route in google maps
function calculateAndDisplayRoute(directionsService, directionsDisplay, address) {
    // Sets the end points
    var startEnd = {
        origin: '2401 Utah Ave S, Seattle, WA 98134',
        destination: address,
        travelMode: google.maps.TravelMode.WALKING
    }

    // Sends the API request and displays the results
    directionsService.route(startEnd, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}