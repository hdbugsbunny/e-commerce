const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const User = require("../models/user");

require("dotenv").config();

const transporter = nodeMailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage: req.flash("error")[0],
    prevInput: { email: "", password: "" },
    totalErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "Signup",
    path: "/signup",
    errorMessage: req.flash("error")[0],
    prevInput: { email: "", password: "", confirmPassword: "" },
    totalErrors: [],
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/reset-password", {
    docTitle: "Reset Password",
    path: "/reset-password",
    errorMessage: req.flash("error")[0],
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token: resetToken } = req.params;

  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      res.render("auth/new-password", {
        docTitle: "New Password",
        path: "/new-password",
        errorMessage: req.flash("error")[0],
        userId: user._id.toString(),
        passwordToken: resetToken,
      });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      docTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      prevInput: { email, password },
      totalErrors: errors.array(),
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          docTitle: "Login",
          path: "/login",
          errorMessage: "Invalid E-Mail!",
          prevInput: { email, password },
          totalErrors: [],
        });
      }

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

          return res.status(422).render("auth/login", {
            docTitle: "Login",
            path: "/login",
            errorMessage: "Invalid Password!",
            prevInput: { email, password },
            totalErrors: [],
          });
        })
        .catch((error) => {
          console.log("🚀 ~ .then ~ error:", error);
          res.redirect("/login");
        });
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      docTitle: "Signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      prevInput: { email, password, confirmPassword },
      totalErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });

      newUser.save();
      transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: "Signup Succeeded!",
        html: "<h1>You Successfully Signed Up!</h1>",
      });
      res.redirect("/login");
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("🚀 ~ crypto.randomBytes ~ err:", err);
      return res.redirect("/reset-password");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "E-mail Address Not Found!");
          return res.redirect("/reset-password");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save();
        transporter.sendMail({
          to: email,
          from: process.env.SENDER_EMAIL,
          subject: "Password Reset!",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:${process.env.PORT}/new-password/${token}">link</a> to set a new password</p>
          `,
        });
        res.redirect("/");
      })
      .catch((error) => {
        const nextError = new Error(error);
        nextError.httpStatusCode = 500;
        return next(nextError);
      });
  });
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;

      resetUser.save();

      res.redirect("/login");
    })
    .catch((error) => {
      const nextError = new Error(error);
      nextError.httpStatusCode = 500;
      return next(nextError);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((error) => {
    console.log("🚀 ~ req.session.destroy ~ error:", error);
    res.redirect("/");
  });
};
