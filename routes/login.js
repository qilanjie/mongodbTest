const express = require('express');
const router = express.Router();


router.get('/',function (req,res) {
    res.render('login',{signupEmail:req.params.signupEmail})

});

module.exports = router;
