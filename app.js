const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// models
const Place = require('./models/place');

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/spotwise')
    .then((result) => {
        console.log('Connected to mongodb')
    }).catch((err) => {
        console.log(err)
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/places', async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });    
})

app.get('/places/:id', async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/show', { place });
})

// app.get('/seed/place', async (req, res) => {
//     const place = new Place({
//         title: 'Empire State Building',
//         price: '$999999',
//         description: 'A great building',
//         location: 'New Tork, NY'
//     })

//     await place.save();
//     res.send(place)
// })

app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`);
});