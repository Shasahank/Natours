/*eslint-disable */
const path = require('path')
const express = require('express');
const morgan = require("morgan")
const rateLimit = require('express-rate-limit');
const helmet = require("helmet")
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require("cookie-parser")


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes")
const reviewRouter = require("./routes/reviewRoutes")
//const viewRouter = require("./routes/viewRoutes")
const app = express();

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'))

// app.use(express.static(path.join(__dirname, 'public')))

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: "10kb" }))
app.use(cookieParser())
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);

app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
    console.log("hello form the middleware");
    next();
})

//app.use("/", viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));

})

app.use(globalErrorHandler);

module.exports = app;


































// app.get("/", (req, res) => {
//     res.json({
//         message: "hello"
//     })
// })

// app.post("/", (req, res) => {
//     res.json("you can post to thos url")
// })