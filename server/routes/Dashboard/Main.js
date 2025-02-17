const express = require("express");
const router = express.Router();
const {
  getProfile,
} = require("../../controllers/Profile");

const { auth } = require("../../middleware/Auth");

router.get("/", auth, getProfile);

module.exports = router;