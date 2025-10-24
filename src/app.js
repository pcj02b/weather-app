import express from 'express';
import path from 'path';
import hbs from 'hbs';
import weatherStackApi from "./utils/weatherStackApi.js";
import mapBoxApi from "./utils/mapBoxApi.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

const app = express();

// Handlebars setup
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'HBS title',
        name: 'Phillip',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About title',
        name: 'Phillip',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help title',
        name: 'Phillip',
        message: 'I need some help.'
    });
});

app.get('/help/*help', (req, res) => {
    res.render('help', {
        title: 'Help article not found',
        name: 'Phillip',
        message: 'I need some help.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'address is required.'
        });
        return;
    }

    mapBoxApi.geoCodeForward(req.query.address, (coordinates, error) => {
        if (error) {
            res.status(400).send({error: error.message});
            return;
        }

        weatherStackApi.getCurrentWeatherAlt(coordinates, ({ temperature, feelslike } = {}, error) => {
            if (error) {
            res.status(400).send({error: error.message});
                return;
            }
            res.send({
                address: req.query.address,
                temperature,
                feelslike,
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'search term required.'
        });
        return;
    }

    res.send({
        products: []
    });
})

// set up 404
app.get('/*fourohfour', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Phillip',
    });
})

app.listen(5001, () => {
    console.log("server running...");
    console.log("http://localhost:5001");
});