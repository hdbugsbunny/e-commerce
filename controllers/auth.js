const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "Signup",
    path: "/signup",
    isAuthenticated: false,
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

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) return res.redirect("/signup");

      const newUser = new User({ email, password, cart: { items: [] } });
      return newUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log("🚀 ~ req.session.destroy ~ error:", error);
    res.redirect("/");
  });
};
