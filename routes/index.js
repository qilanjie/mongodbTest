const express = require('express');

const router = express.Router();
var app=require('../app');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {authenticated: false});
});
router.get('/signup', function (req, res,next) {
    res.render('signup');
});
router.post('/signup',function (req, res, next) {


//    console.log(req.body.user);
    var user=new User(req.body.user);
    user.save(function (err) {
        console.log(user.email);
        if(err)return next(err);

        res.redirect('/login'+"?signupEmail="+user.email);
    })
});
router.get('/login',function (req,res) {
    console.log(req.query.signupEmail);
    res.render('login',{signupEmail:req.query.signupEmail})

});
router.post('/login',function (req,res) {
    User.findOne({email:req.body.user.email,password:req.body.user.password},function (err,doc) {
        if(err)return next(err);
        if(!doc)return res.send('<p>User not found. Go back and try again');
        console.log(req.session);
        req.session.loggedIn=doc._id.toString();
        res.redirect('/');

    })
router.get('/logout',function (req,res) {
req.session.loggedIn=null;
})
})
module.exports = router;
