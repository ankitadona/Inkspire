const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();   
const protect = require("../middleware/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login",authController.login);
router.post("/logout",authController.logout);
router.get("/user", protect, authController.getUser);


module.exports = router;