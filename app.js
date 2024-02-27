const express = require('express')
const axios = require('axios');

const app = express();
app.use(express.json());

async function calculateDeliveryTime(restaurantAddress, deliveryAddress) {
    try {
        const restaurantCoordinates = await geocodeAddress(restaurantAddress);
        const deliveryCoordinates = await geocodeAddress(deliveryAddress);
        const travelTime = await getTravelTime(restaurantCoordinates, deliveryCoordinates);
        return travelTime;
    } catch (error) {
        throw new Error('Error calculating delivery time: ' + error.message);
    }
}

async function geocodeAddress(address) {
    try {
        console.log('Making request to MapQuest API for geocoding...'); // Log before making the request

        const response = await axios.get('https://www.mapquestapi.com/geocoding/v1/address', {
            params: {
                key: 'buUSMuKDf6xm1UluloRUmGPiQbog7Djl', 
                location: address 
            }
        });

        console.log('MapQuest Geocoding API response:', response.data); // Log after receiving the response

        const { lat, lng } = response.data.results[0].locations[0].latLng;
        return { lat, lng };
    } catch (error) {
        throw new Error('Error geocoding address: ' + error.message);
    }
}

async function getTravelTime(origin, destination) {
    try {
        const response = await axios.get('https://www.mapquestapi.com/directions/v2/route', {
            params: {
                key: 'buUSMuKDf6xm1UluloRUmGPiQbog7Djl', 
                from: `${origin.lat},${origin.lng}`,
                to: `${destination.lat},${destination.lng}`,
                routeType: 'fastest'
            }
        });
        console.log('Directions API Response:', response.data);
        const { formattedTime } = response.data.route.legs[0];
        return formattedTime;
    } catch (error) {
        throw new Error('Error getting travel time: ' + error.message);
    }
}

app.post('/estimate_delivery_time', async (req, res) => {
    try {
        // Extract address details from the request body
        const { restaurantStreet, restaurantCity, restaurantState, restaurantZip, deliveryStreet, deliveryCity, deliveryState, deliveryZip } = req.body;
        // Construct the address strings for restaurant and delivery addresses
        const restaurantAddress = `${restaurantStreet}, ${restaurantCity}, ${restaurantState}, ${restaurantZip}`;
        const deliveryAddress = `${deliveryStreet}, ${deliveryCity}, ${deliveryState}, ${deliveryZip}`;
        // Process the addresses and calculate estimated delivery time
        const estimatedDeliveryTime = await calculateDeliveryTime(restaurantAddress, deliveryAddress);
        // Send the estimated delivery time as a JSON response
        res.json({ estimatedDeliveryTime });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});