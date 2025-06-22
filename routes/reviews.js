const express = require('express');
const Place = require('../models/place');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const isValidObjectId = require('../middleware/isValidObjectId');

const router = express.Router( {mergeParams: true} );

// models
const Review = require('../models/review');

// Schemas
const { reviewSchema } = require('../schemas/review');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
}

router.post('/', isValidObjectId('/places'), validateReview, wrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.place_id);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash('success_msg', 'Review added successfully');
    res.redirect(`/places/${req.params.place_id}`);
}))

router.delete('/:review_id', isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id }});
    await Review.findByIdAndDelete(review_id);
    req.flash('success_msg', 'Review deleted successfully');
    res.redirect(`/places/${place_id}`);
}))

module.exports = router;