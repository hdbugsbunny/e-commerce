module.exports = (req, res, next) => {
  const { isAuthenticated } = req.session;
  if (!isAuthenticated) return res.redirect("/login");

  next();
};
