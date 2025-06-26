const express = require('express');
const Place = require('../models/place');
const ReviewController = require('../controllers/reviews');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const { isAuthorReview } = require('../middlewares/isAuthor');

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

router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync(ReviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy))

module.exports = router;