const express = require('express');
const fs = require('fs');
const AppError=require('./utils/AppError');
const app = express();
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const tourRouter=require("./routes/tourRoutes");
const userRouter=require("./routes/userRoutes");

// MIDDElWARES 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`))
app.use((req , res , next ) =>{
  req.requestTime = new Date().toISOString();
  next();
})


// ROUTES 

app.use('/API/V1/tours',tourRouter);
app.use('/API/V1/users',userRouter);

app.all('*', (req, res, next) => {
  
    // const err = new Error(`can't find ${req.originalUrl} in this server`);
    // err.status='fail';
    // err.statusCode=404;
    // next(err)
    next(new AppError(`can't find ${req.originalUrl} in this server`,404));
});

app.use(globalErrorHandler);

module.exports=app;
