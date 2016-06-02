// Adds the event listeners for the buttons
var buttons = document.getElementsByClass("dirButton");
for var b in buttons
    b.addEventListener("click", directions(b));

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