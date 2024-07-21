const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';

function addressForm() {
    const address1 = document.getElementById("address1").value;
    const address2 = document.getElementById("address2").value;

    geocodeAddress(address1)const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
function addressForm() {
    const address1 = document.getElementById("address1").value;
    const address2 = document.getElementById("address2").value;

    geocodeAddress(address1)
        .then(result => {
            const coords1 = result;
            console.log('Coordinates for address 1:', coords1);
            return geocodeAddress(address2).then(coords2 => {
                console.log('Coordinates for address 2:', coords2);
                generateMap(coords1, coords2);
                return calculateWalkingDistance(coords1, coords2);
            });
        })
        .then(dist => {
            console.log('Walking distance:', dist, 'meters');
            const distContainer = document.getElementById("container");
            if (distContainer) {
                distContainer.innerText = `Walking distance: ${dist} meters`;
            } else {
                console.error("Container element not found");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function calculateWalkingDistance(coords1, coords2) {
        const url = `https://router.hereapi.com/v8/routes?transportMode=pedestrian&origin=${coords1[0]},${coords1[1]}&destination=${coords2[0]},${coords2[1]}&return=summary,polyline,actions&apikey=${apiKey}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Routing request failed');
                }
                return response.json();
            })
            .then(data => {
                if (data.routes.length > 0) {
                    const route = data.routes[0];
                    const distance = route.sections[0].summary.length;
                    const polyline = route.sections[0].polyline;
                    const actions = route.sections[0].actions;
                    drawRoute(polyline);
                    displayDirections(actions);
                    return distance;
                } else {
                    throw new Error('No routes found');
                }
            })
            .catch(error => {
                console.error('Error fetching route:', error);
                throw error;
            });
    }

function generateMap(coords1, coords2) {
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
            center: { lat: coords1[0], lng: coords1[1] },
            zoom: 15,
            pixelRatio: window.devicePixelRatio || 1
        }
    );

    // Enable map events
    const mapEvents = new H.mapevents.MapEvents(map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Add markers for the addresses
    const marker1 = new H.map.Marker({ lat: coords1[0], lng: coords1[1] });
    const marker2 = new H.map.Marker({ lat: coords2[0], lng: coords2[1] });
    map.addObject(marker1);
    map.addObject(marker2);

    // Save the map instance for later use
    window.hereMap = map;
}

function drawRoute(polyline) {
    const map = window.hereMap;
    if (!map) {
        console.error('Map instance not found');
        return;
    }

    const linestring = H.geo.LineString.fromFlexiblePolyline(polyline);
    const routeLine = new H.map.Polyline(linestring, {
        style: { strokeColor: 'blue', lineWidth: 5 }
    });

    map.addObject(routeLine);
    map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
}

function displayDirections(actions) {
    const directionsContainer = document.getElementById('directionsContainer');
    if (!directionsContainer) {
        console.error('Directions container element not found');
        return;
    }

    directionsContainer.innerHTML = ''; // Clear previous directions

    actions.forEach(action => {
        const direction = document.createElement('p');
        direction.innerText = action.instruction;
        directionsContainer.appendChild(direction);
    });
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
        .then(result => {
            const coords1 = result;
            console.log('Coordinates for address 1:', coords1);
            return geocodeAddress(address2).then(coords2 => {
                console.log('Coordinates for address 2:', coords2);
                generateMap(coords1, coords2);
                return calculateWalkingDistance(coords1, coords2);
            });
        })
        .then(dist => {
            console.log('Walking distance:', dist, 'meters');
            document.addEventListener("DOMContentLoaded", function () {
                // Select the container element by its ID
                let dist_container = document.getElementById("container");

                if (dist_container) {
                    dist_container.innerText = dist + ' meters';
                } else {
                    console.error("Container element not found");
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function calculateWalkingDistance(coords1, coords2) {
    const url = `https://router.hereapi.com/v8/routes?transportMode=pedestrian&origin=${coords1[0]},${coords1[1]}&destination=${coords2[0]},${coords2[1]}&return=summary&apikey=${apiKey}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Routing request failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.routes.length > 0) {
                const route = data.routes[0];
                const distance = route.sections[0].summary.length;
                console.log('Walking distance:', distance, 'meters');
                return distance;
            } else {
                throw new Error('No routes found');
            }
        })
        .catch(error => {
            console.error('Error fetching route:', error);
            throw error;
        });
}

function generateMap(coords1, coords2) {
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
            center: { lat: coords1[0], lng: coords1[1] },
            zoom: 15,
            pixelRatio: window.devicePixelRatio || 1
        }
    );

    // Enable map events
    const mapEvents = new H.mapevents.MapEvents(map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Add markers for the addresses
    const marker1 = new H.map.Marker({ lat: coords1[0], lng: coords1[1] });
    const marker2 = new H.map.Marker({ lat: coords2[0], lng: coords2[1] });
    map.addObject(marker1);
    map.addObject(marker2);
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
