class APIFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
    filter() {
      const queryObj = { ...this.queryStr };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      //const query =Tour.find(queryObj);
  
      // Advanced Filtring
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      if (this.queryStr.sort) {
        //sort(price rate)
        const sortby = this.queryStr.sort.split(',').join(' ');
        this.query = this.query.sort(sortby);
      }
      return this;
    }
    limitFields() {
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
    Paginate() {
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
    
  }
  module.exports=APIFeatures;