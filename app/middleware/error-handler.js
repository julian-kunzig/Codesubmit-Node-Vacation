
module.exports = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      name: err.name,
      message: err.message
    });
  } else {
    next();
  }
};