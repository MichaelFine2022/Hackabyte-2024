const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';

document.addEventListener('DOMContentLoaded', function() {
    let timerInterval;
    let timerSeconds = 0;
    let timerRunning = false;

    function addressForm() {
        const address1 = document.getElementById("address1").value;
        const address2 = document.getElementById("address2").value;
        const weight = parseFloat(document.getElementById("weight").value);

        if (isNaN(weight) || weight <= 0) {
            alert("Please enter a valid weight.");
            return;
        }

        geocodeAddress(address1)
            .then(result => {
                const coords1 = result;
                return geocodeAddress(address2).then(coords2 => {
                    generateMap(coords1, coords2);
                    return calculateWalkingDistance(coords1, coords2);
                });
            })
            .then(({ distance, actions }) => {
                const distContainer = document.getElementById("container");
                const distContainerI = document.getElementById("containerI");
                if (distContainer) {
                    distContainer.innerText = `Walking distance: ${distance.toFixed(2)} meters`;
                    distance *= 3.281; // Convert meters to feet
                    distance = distance.toFixed(2);
                    distContainerI.innerText = `Walking distance: ${distance} feet`;

                    // Calculate and display calories burned
                    const caloriesBurned = calculateCaloriesBurned(distance, weight);
                    const caloriesContainer = document.getElementById("caloriesBurnedContainer");
                    if (caloriesContainer) {
                        caloriesContainer.innerText = `Calories burned when walked: ${caloriesBurned.toFixed(2)} calories`;
                    }

                    //displayDirections(actions);
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
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    if (route.sections && route.sections.length > 0) {
                        const distance = route.sections[0].summary.length;
                        const actions = route.sections[0].actions.map(action => action.instruction);
                        const polyline = route.sections[0].polyline;
                        drawRoute(polyline);
                        displayDirections(actions);
                        return { distance, actions };
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

        const platform = new H.service.Platform({
            apikey: apiKey
        });


        const defaultLayers = platform.createDefaultLayers();

        const map = new H.Map(
            mapContainer,
            defaultLayers.vector.normal.map,
            {
                center: { lat: (coords1[0] + coords2[0]) / 2, lng: (coords1[1] + coords2[1]) / 2 },
                zoom: 15,
                pixelRatio: window.devicePixelRatio || 1
            }
        );


        const mapEvents = new H.mapevents.MapEvents(map);
        const behavior = new H.mapevents.Behavior(mapEvents);
        const ui = H.ui.UI.createDefault(map, defaultLayers);

        function createMarker(lat, lng, svg) {
            const icon = new H.map.Icon(svg);
            const marker = new H.map.Marker({ lat, lng }, { icon });
            map.addObject(marker);
            return marker;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Center the map on the current position
                    map.setCenter({ lat, lng });
                    createMarker(lat, lng, 'https://img.icons8.com/ios-filled/50/ff0000/marker.png');
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        const marker1 = new H.map.Marker({ lat: coords1[0], lng: coords1[1] });
        const marker2 = new H.map.Marker({ lat: coords2[0], lng: coords2[1] });
        map.addObject(marker1);
        map.addObject(marker2);

        // Save the map instance for later use
        window.hereMap = map;

        // Calculate and draw route
        const router = platform.getRoutingService();
        router.calculateRoute({
            mode: 'fastest;pedestrian',
            waypoint0: `geo!${coords1[0]},${coords1[1]}`,
            waypoint1: `geo!${coords2[0]},${coords2[1]}`
        }, (result) => {
            if (result.routes.length) {
                const route = result.routes[0];
                const lineString = new H.geo.LineString();
                route.sections[0].polyline.forEach((point) => {
                    const [lat, lng] = point.split(',');
                    lineString.pushLatLngAlt(lat, lng);
                });
                const polyline = new H.map.Polyline(lineString, {
                    style: {
                        strokeColor: 'blue',
                        lineWidth: 5
                    }
                });
                map.addObject(polyline);
                map.getViewModel().setLookAtData({ bounds: polyline.getBoundingBox() });
            }
        }, (error) => {
            console.error('Error fetching route:', error);
        });
    }
    
    function displayDirections(actions) {
    const directionsContainer = document.getElementById('directionsContainer');
    if (!directionsContainer) {
        console.error('Directions container element not found');
        return;
    }


    directionsContainer.innerHTML = '';

    if (Array.isArray(actions) && actions.length > 0) {
        // Create a list to hold the directions
        const ul = document.createElement('ul');
        
        actions.forEach((action, index) => {
            // Debugging: log each action to verify content
            console.log(`Action ${index}:`, action);

            // Check if action is an object and has an 'instruction' property
            if (typeof action === 'object' && action !== null && 'instruction' in action) {
                // Create a list item for each action
                const li = document.createElement('li');
                li.textContent = action.instruction;
                ul.appendChild(li); // Add the list item to the list
            } else {
                // Handle unexpected formats
                console.warn(`Unexpected action format at index ${index}:`, action);
            }
        });

        // Append the list to the directions container
        directionsContainer.appendChild(ul);
    } else {
        // Display a message if no directions are available
        directionsContainer.textContent = 'No directions available.';
    }
}



    function calculateCaloriesBurned(distanceInFeet, weightInPounds) {
        const distanceInMiles = distanceInFeet / 5280; 
        const caloriesPerMilePerPound = 0.5; 
        return distanceInMiles * weightInPounds * caloriesPerMilePerPound;
    }

    function geocodeAddress(address) {
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

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

    function startTimer() {
        if (!timerRunning) {
            timerInterval = setInterval(() => {
                timerSeconds++;
                const hours = Math.floor(timerSeconds / 3600);
                const minutes = Math.floor((timerSeconds % 3600) / 60);
                const seconds = timerSeconds % 60;
                document.getElementById('timerDisplay').innerText =
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
            timerRunning = true;
        }
    }

    function stopTimer() {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerSeconds = 0;
        document.getElementById('timerDisplay').innerText = '00:00:00';
        timerRunning = false;
    }

    function toggleMenu(menuId) {
        const directionsMenu = document.getElementById('sideMenu');
        const timerMenu = document.getElementById('timerMenu');

        if (menuId === 'sideMenu') {
            if (timerMenu.classList.contains('open')) {
                timerMenu.classList.remove('open');
            }
        } else if (menuId === 'timerMenu') {
            if (directionsMenu.classList.contains('open')) {
                directionsMenu.classList.remove('open');
            }
        }

        const menu = document.getElementById(menuId);
        menu.classList.toggle('open');
    }

    document.getElementById('calculateDistanceButton').addEventListener('click', addressForm);
    document.getElementById('toggleDirectionsMenuButton').addEventListener('click', () => {
        toggleMenu('sideMenu');
    });
    document.getElementById('toggleTimerButton').addEventListener('click', () => {
        toggleMenu('timerMenu');
    });
    document.getElementById('closeDirectionsButton').addEventListener('click', () => {
        document.getElementById('sideMenu').classList.remove('open');
    });
    document.getElementById('closeTimerButton').addEventListener('click', () => {
        document.getElementById('timerMenu').classList.remove('open');
    });
    document.getElementById('startTimerButton').addEventListener('click', startTimer);
    document.getElementById('stopTimerButton').addEventListener('click', stopTimer);
    document.getElementById('resetTimerButton').addEventListener('click', resetTimer);
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
});
