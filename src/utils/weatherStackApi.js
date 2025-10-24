import axios from 'axios';
import https from 'https';
import * as dotenv from 'dotenv';

const apiKey = dotenv.WEATHERSTACK_ACCESS_KEY;
const baseUrl = dotenv.WEATHERSTACK_BASE_URL;

const getCurrentWeather = (coordinates, callback) => {
    axios
        .get(`${baseUrl}/current`, {
            params: {
                access_key: apiKey,
                query: `${coordinates[0]},${coordinates[1]}`,
            }
        })
        .then(({ status, data }) => {
            if (status > 299)
                callback(undefined, new Error('get current weather error'));
            callback(data.current, undefined);
        })
        .catch((error) => {
            callback(undefined, error);
        });
}

const getCurrentWeatherAlt = (coordinates, callback) => {

    let url = baseUrl;
    url += '/current';
    url += '?access_key=' + apiKey;
    url += '&query=' + encodeURIComponent(`${coordinates[0]},${coordinates[1]}`);

    const request = https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk.toString();
        });

        response.on('end', () => {
            callback(JSON.parse(data).current, undefined);
        });
    });

    request.on('error', (error) => console.log(error))

    request.end();
}

export default {
    getCurrentWeather,
    getCurrentWeatherAlt
}