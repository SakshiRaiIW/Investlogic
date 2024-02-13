const express = require("express");

const  {loginController, signUpController, verifyToken, policyController , getPolicy} =require('../controllers');


const router = express.Router();
router.post('/login', loginController);
router.post('/signup', signUpController);
router.get ('/home' , verifyToken);
router.get('/policydocs' , policyController);
router.get('/getpolicydata', getPolicy);

module.exports = router;
