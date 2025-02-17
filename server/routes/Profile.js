const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteUser,
  updateProfilePicture,
  removeProfilePicture
} = require("../controllers/Profile");

const { auth } = require("../middleware/Auth");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.delete("/", auth, deleteUser);
router.put("/picture", auth, updateProfilePicture);
router.delete("/picture", auth, removeProfilePicture);

module.exports = router;