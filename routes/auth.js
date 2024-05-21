const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset-password", authController.getResetPassword);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/reset-password", authController.postResetPassword);

router.post("/logout", authController.postLogout);

module.exports = router;
