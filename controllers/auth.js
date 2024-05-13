const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "Signup",
    path: "/signup",
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.redirect("/login");

      bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          if (passwordMatch) {
            req.session.isAuthenticated = true;
            req.session.user = user;
            return req.session.save((error) => {
              console.log("🚀 ~ req.session.save ~ error:", error);
              res.redirect("/");
            });
          }

          return res.redirect("/login");
        })
        .catch((error) => {
          console.log("🚀 ~ .then ~ error:", error);
          res.redirect("/login");
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

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email,
          password: hashedPassword,
          cart: { items: [] },
        });

        newUser.save();
        res.redirect("/login");
      });
    })
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
