const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  const isAuthenticated =
    req.get("Cookie")?.split(";")[1]?.trim()?.split("=")[1] === "true" || false;
  console.log("🚀 ~ session:", req.session);
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6638c06182a1a0a5084ca839")
    .then((user) => {
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save((error) => {
        console.log("🚀 ~ req.session.save ~ error:", error);
        res.redirect("/");
      });
    })
    .catch((error) => {
      console.log("🚀 ~ app.use ~ error:", error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log("🚀 ~ req.session.destroy ~ error:", error);
    res.redirect("/");
  });
};
