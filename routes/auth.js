const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

//* /login => GET
router.get("/login", authController.getLogin);

//* /signup => GET
router.get("/signup", authController.getSignup);

//* /reset-password => GET
router.get("/reset-password", authController.getResetPassword);

//* /new-password/:token => GET
router.get("/new-password/:token", authController.getNewPassword);

//* /login => POST
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Enter Valid Email!").normalizeEmail(),
    body(
      "password",
      "Enter Valid Password With Only Numbers, Text And Atleast 5 Characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

//* /signup => POST
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Enter Valid Email!")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail Already Exists!");
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "Enter Valid Password With Only Numbers, Text And Atleast 5 Characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match!");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

//* /reset-password => POST
router.post("/reset-password", authController.postResetPassword);

//* /new-password => POST
router.post("/new-password", authController.postNewPassword);

//* /logout => POST
router.post("/logout", authController.postLogout);

module.exports = router;
