// Adds the event listeners for the buttons
var buttons = document.getElementsByClass("dirButton");
for var b in buttons
    b.addEventListener("click", directions(b));

function initMap() {
var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
var map = new google.maps.Map(document.getElementById('map'), {
zoom: 7,
center: {lat: 41.85, lng: -87.65}
});
directionsDisplay.setMap(map);
var onChangeHandler = function() {
calculateAndDisplayRoute(directionsService, directionsDisplay);
};
document.getElementById('start').addEventListener('change', onChangeHandler);
document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
directionsService.route({
origin: '2401 Utah Ave S, Seattle, WA 98134',
destination: document.getElementById('end').value,
travelMode: google.maps.TravelMode.DRIVING
}, function(response, status) {
if (status === google.maps.DirectionsStatus.OK) {
directionsDisplay.setDirections(response);
} else {
window.alert('Directions request failed due to ' + status);
}
});
}

// Gets the user directions
function directions(var b) {
    event.preventDefault();

    // MAKE THE AJAX
    req = new XMLHttpRequest();
    var address = "/get-address?id=" + b.value;
    req.open("GET", "/get-address", true);
    req.addEventListener("load", function (){
        // Directions code goes here

        
    });
    req.send();
}