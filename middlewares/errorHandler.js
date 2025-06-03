const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      details: err.errors,
    });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate key error",
      field: Object.keys(err.keyPattern)[0],
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
