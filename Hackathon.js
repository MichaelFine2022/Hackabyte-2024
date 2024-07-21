coords1 = [];
coords2 = [];
//My personal API Key, in deployment this would be removed
const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
function addressForm() {
    const address1 = document.getElementById("address1").value;
    const address2 = document.getElementById("address2").value;

    let coords1, coords2;

    geocodeAddress(address1)
        .then(result => {
            coords1 = result;
            console.log('Coordinates for address 1:', coords1);
            // Call generateMap with coords1
            return geocodeAddress(address2);
        })
        .then(result => {
            coords2 = result;
            console.log('Coordinates for address 2:', coords2);
            generateMap(coords1, coords2);
            // Optionally handle coords2 if needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function generateMap(coords, coords1) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) {
        console.error('Map container element not found');
        return;
    }

    // Initialize HERE Maps platform
    const platform = new H.service.Platform({
        apikey: apiKey
    });

    // Obtain the default map layers
    const defaultLayers = platform.createDefaultLayers();

    // Create a map instance
    const map = new H.Map(
        mapContainer,
        defaultLayers.vector.normal.map,
        {
            center: { lat: coords[0], lng: coords[1] },
            zoom: 12,
            pixelRatio: window.devicePixelRatio || 1
        }
    );

    // Enable map events
    const mapEvents = new H.mapevents.MapEvents(map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Example: Add a marker for the address
    const marker = new H.map.Marker({ lat: coords[0], lng: coords[1] });
    const marker1 = new H.map.Marker({ lat: coords1[0], lng: coords1[1] });
    map.addObject(marker);
    map.addObject(marker1);
}

function geocodeAddress(address) {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    // Fetch geocoding data
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }
            return response.json();
        })
        .then(data => {
            const location = data.items[0].position;
            return [location.lat, location.lng];
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
            throw error;
        });
}
