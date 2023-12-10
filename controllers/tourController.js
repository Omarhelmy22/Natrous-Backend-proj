const Tour = require('./../models/tourModel');
const APIFeatures=require('./../utils/apiFeatures'); 
const catchAsync = require('./../utils/catchAsync');
const AppError=require('./../utils/AppError');
/* read from json files 
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`)
  ); */


exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,difficulty';
  next();
};




exports.getAllTours = catchAsync(async(req, res, next) => {
 
    
    //Excute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .Paginate();
    const tours = await features.query;

    //Send response
    res.json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour =catchAsync(async(req, res, next) => {
  
    const tour = await Tour.findById(req.params.id);
    if(!tour){
      return next(new AppError("No Tour Found with this ID",404));
    }
    res.status(200).json({
      status: 'success',

      data: {
        tours: tour,
      },
    });
});

exports.createTour = catchAsync(async(req, res, next) => {
  
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
});

exports.updateTour = catchAsync(async(req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour){
      return next(new AppError("No Tour Found with this ID",404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
});
exports.deleteTour = catchAsync(async(req, res, next) => {
  
   const tour= await Tour.findByIdAndDelete(req.params.id);
   if(!tour){
    return next(new AppError("No Tour Found with this ID",404));
  }
    res.status(204).json({
      status: 'success',
      data: null,
    });
    
});

exports.getTourStats = catchAsync(async(req, res, next) => {

  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, 
        numTours: { $count: {} },
        numRatings: { $sum: '$ratingQuantity' },
        avrRatigs: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    },
  });
});

exports.getMonthlyPlan =catchAsync(async(req, res, next) => {
  
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
});