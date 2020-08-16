
const express = require('express');
const router = express.Router();

//var bodyParser=require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/', function (req, res, next) {
    res.render('signup');
});

router.post('/',function (req, res, next) {

    const app = require('../app');
//     var bodyParser = require('body-parser');
    // parse application/x-www-form-urlencoded
//    app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//    app.use(bodyParser.json())


     app.users.insert(req.body, function (err, doc) {
        if (err) return next(err);
         console.log(doc);
        res.redirect('/login' + doc[1].email);
    });

});

module.exports = router;
