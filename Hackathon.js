var address1;
var address2;
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
    //My personal API Key, in deployment this would be removed
    const apiKey = 'eoa2vtgM9O5GnX7Nth3H9CruvBRaQeYdzuWp-Dc8JDg';
    
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
