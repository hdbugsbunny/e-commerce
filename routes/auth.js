const express = require("express");
const { check } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset-password", authController.getResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Enter Valid Email!")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email is forbidden!");
      }
      return true;
    }),
  authController.postSignup
);

router.post("/reset-password", authController.postResetPassword);

router.post("/new-password", authController.postNewPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
