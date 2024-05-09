exports.getLogin = (req, res, next) => {
  const { isAuthenticated } = req;
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  req.isAuthenticated = true;
  res.redirect("/");
};
