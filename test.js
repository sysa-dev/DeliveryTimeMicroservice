const axios = require('axios');

const requestData = {
    restaurantStreet: '259 Lake Ave.',
    restaurantCity: 'Metuchen',
    restaurantState: 'NJ',
    restaurantZip: '08840',
    deliveryStreet: '254 Main St.',
    deliveryCity: 'Metuchen',
    deliveryState: 'NJ',
    deliveryZip: '08840'
};

axios.post('http://localhost:3000/estimate_delivery_time', requestData)
    .then(response => {
        console.log('Estimated Delivery Time:', response.data.estimatedDeliveryTime);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });