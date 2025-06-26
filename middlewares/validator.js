const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas/review');
const { placeSchema } = require('../schemas/place');

module.exports.validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
}