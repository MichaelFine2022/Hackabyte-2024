var address1;
var address2;
//My personal API Key, in deployment this would be removed
const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
arr1 = [];
arr2 = [];
var cond = true;
function addressForm() {
    address1 = document.getElementById("address1").value;
    address2 = document.getElementById("address2").value;
    arr1 = geocodeAddress(address1);
    arr2 = geocodeAddress(address2);
    
    return false;
}

function generateMap(start_la, start_lo){
    //Creating an interactive map that centers and zooms in on the first address
    const platform = new H.service.Platform({
        apikey: apiKey
    });
    
    //create the default layers
    const defaultLayers = platform.createDefaultLayers();
    
    // Instantiate (and display) a map object:
    console.log(start_la);
    console.log(start_lo);
    const map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            center: { lat: start_la, lng: start_lo }, // the first address
            zoom: 10,
            pixelRatio: window.devicePixelRatio || 1
        }
    );
    
    // Enable event systems on the map
    const mapEvents = new H.mapevents.MapEvents(map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    
    // Enable UI:
    const ui = H.ui.UI.createDefault(map, defaultLayers);
}

function geocodeAddress(address) {
    const hereApiBaseUrl = 'https://geocoder.search.hereapi.com/v1/geocode';
    const url=`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    // Fetches data from HERE Tech API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error with Network response');
            }
            return response.json();
        })
        .then(data => {
            // Extract latitude and longitude from the response
            const location = data.items[0].position;
            return [location.lat, location.lng];
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}


var address1;
var address2;
//My personal API Key, in deployment this would be removed
const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
const arr1 = [];
const arr2 = [];
var cond = true;
function addressForm() {
            address1 = document.getElementById("address1").value;
            const arr1 = geocodeAddress(address1);
            address2 = document.getElementById("address2").value;
            const arr2 = geocodeAddress(address2);
            return false;
}
function geocodeAddress(address) {
    const hereApiBaseUrl = 'https://geocoder.search.hereapi.com/v1/geocode';
    const url=`https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    // Fetches data from HERE Tech API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error with Network response');
            }
            return response.json();
        })
        .then(data => {
            // Extract latitude and longitude from the response
            const location = data.items[0].position;
            return [location.lat, location.lng];
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}
