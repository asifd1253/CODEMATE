const adminAuth = (req, res, next) => {
  let token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.send("Not permitted.");
  }
};

const userAuth = (req, res, next) => {
  let token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.send("Not permitted.");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
