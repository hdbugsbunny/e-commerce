const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset-password", authController.getResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Enter Valid Email!"),
    body(
      "password",
      "Enter Valid Password With Only Numbers, Text And Atleast 5 Characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Enter Valid Email!")
      .custom(async (value) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is forbidden!");
        // }
        // return true;
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("E-Mail Already Exists!");
        }
      }),
    body(
      "password",
      "Enter Valid Password With Only Numbers, Text And Atleast 5 Characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/reset-password", authController.postResetPassword);

router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
