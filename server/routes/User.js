const express = require("express");
const router = express.Router();

const {
  sendOtp,
  loginHandler,
  changePassword,
  logOut
} = require("../controllers/Login");

const { 
  signupHandler
} = require('../controllers/Signup');

const {
  updatePassword,
  resetPasswordAndSendMailWithUrl
} = require('../controllers/ResetPassword');

const { auth } = require("../middleware/Auth");

router.post("/send-otp", sendOtp);
router.post("/login", loginHandler);
router.post("/signup", signupHandler);
router.post("/password/change", auth, changePassword);
router.post("/password/reset", resetPasswordAndSendMailWithUrl);
router.post("/password/update", updatePassword);
router.get("/logout", auth, logOut);

module.exports = router;