const express = require("express");
const userController = require('../controllers/userController');
const router = express.Router();
const checkAuthToken = require('../middlewares/checkAuthToken')
router.get("/",checkAuthToken,userController.getAllUsers);
router.post("/",userController.createUser);
router.post("/",userController.bulkUpload);
router.post("/login",userController.login);
router.post("/refresh",userController.getRefreshToken);
router.post("/logout",userController.logout);
module.exports = router;
