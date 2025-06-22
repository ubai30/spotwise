const ejsMate = require('ejs-mate');
const express = require('express');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/spotwise')
    .then((result) => {
        console.log('Connected to mongodb')
    }).catch((err) => {
        console.log(err)
    });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/places', require('./routes/places'));
app.use('/places/:place_id/reviews', require('./routes/reviews'));

// Catch-all 404 route
app.all('/*splat', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!'
  res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log(`Server is running on http://127.0.0.1:3000`);
});