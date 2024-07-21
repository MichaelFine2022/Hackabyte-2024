const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
document.addEventListener('DOMContentLoaded', function() {
    function addressForm() {
        const address1 = document.getElementById("address1").value;
        const address2 = document.getElementById("address2").value;

        geocodeAddress(address1)
            .then(result => {
                const coords1 = result;
                return geocodeAddress(address2).then(coords2 => {
                    generateMap(coords1, coords2);
                    return calculateWalkingDistance(coords1, coords2);
                });
            })
            .then(dist => {
                const distContainer = document.getElementById("container");
                const distContainerI = document.getElementById("containerI");
                if (distContainer) {
                    distContainer.innerText = `Walking distance: ${dist} meters`;
                    dist *= 3.281;
                    dist = dist.toFixed(2);
                    distContainerI.innerText = `Walking distance: ${dist} feet`;
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
            console.log('Route data:', data); // Log the entire response to debug
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                if (route.sections && route.sections.length > 0) {
                    const distance = route.sections[0].summary.length;
                    return distance;
                } else {
                    throw new Error('No sections found in route');
                }
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
                center: { lat: (coords1[0] + coords2[0]) / 2, lng: (coords1[1] + coords2[1]) / 2 },
                zoom: 15,
                pixelRatio: window.devicePixelRatio || 1
            }
        );

        // Enable map events
        const mapEvents = new H.mapevents.MapEvents(map);
        const behavior = new H.mapevents.Behavior(mapEvents);
        const ui = H.ui.UI.createDefault(map, defaultLayers);
        
        //creates a red icon for the current location
        const redIconSVG = 'https://img.icons8.com/ios-filled/50/ff0000/marker.png';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Center the map on the current position
                map.setCenter({ lat, lng });
                function createMarker(lat, lng, svg) {
                    const icon = new H.map.Icon(svg);
                    const marker = new H.map.Marker({ lat, lng }, { icon });
                    map.addObject(marker);
                    return marker;
                }
                createMarker(lat,lng,redIconSVG);
                // Add a marker for the current position
               

            },
            (error) => {
                console.error('Error getting location:', error);
            }
        );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

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

    // Expose addressForm to global scope
    window.addressForm = addressForm;
});
