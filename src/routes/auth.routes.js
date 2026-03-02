const express = require('express');
const authController=require('../controllers/auth.Controllers')
const router = express.Router()
router.post('/register',authController.registerUser)
module.exports  = router