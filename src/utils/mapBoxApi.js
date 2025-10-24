import axios from 'axios';

const apiKey = 'pk.eyJ1IjoicGNqYWNvYnMyMCIsImEiOiJjbWgyNHdxZGkxZWdxMmtxMjJ1b3RqNGVkIn0.HKdKW2WBN69l_cc4wgjPzQ';
const baseUrl = 'https://api.mapbox.com';

const geoCodeForward = (query, callback) => {
    axios
        .get(`${baseUrl}/search/geocode/v6/forward`, {
            params: {
                access_token: apiKey,
                q: query,
            }
        })
        .then(({status, data}) => {
            if (status > 299)
                callback(undefined, new Error('geocode forward error'));
            if (data.features.length === 0)
                callback(undefined, new Error('geocode information not found'));
            const feature = data.features[0];
            callback([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], undefined)
        })
        .catch((error) => {
            callback(undefined, new Error(error.message))
        });
}

export default {
    geoCodeForward
}