function addressForm() {
            var address1 = document.getElementById("address1").value;
            var address2 = document.getElementById("address2").value;
            return false;
}

function geocodeAddress(address) {
    const hereApiBaseUrl = 'https://geocoder.search.hereapi.com/v1/geocode';
    //My personal API Key, in deployment this would be removed
    const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
    
    const url=`https://geocode.search.hereapi.com/v1/geocodeq=${encodeURIComponent(address)}&apiKey=${apiKey}`;

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
            console.log(`Coordinates for ${address}: ${location.lat}, ${location.lng}`);
            return [location.lat, location.lng];
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
    }
