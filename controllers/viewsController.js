/*eslint-disable*/

const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find();

    res.render('overview', {
        title: "all tours",
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        feilds: 'review rating user'
    })

    res.render('tour', {
        title: `${tour.name} tour`,
        tour
    })
})

exports.getLoginForm = (req, res) => {
    res.render('login', {
        title: "log into your account"
    })
}