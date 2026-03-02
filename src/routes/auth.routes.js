const express = require('express');
const authController=require('../controllers/auth.Controllers')
const router = express.Router()
router.post('/register',authController)
module.exports  = router