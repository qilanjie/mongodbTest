const createError = require('http-errors');
const express = require('express'), mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret', resave: false,
    saveUninitialized: true
}));
app.use(function (req,res,next) {
    if(req.session.loggedIn){

        res.locals.authenticated=true;//('authenticated',true);
        User.findById(req.session.loggedIn,function (err,doc) {
            if(err) return next(err);
            console.log(doc);
            res.locals.me =doc;// ('me',doc);
            next();

        });
    }
    else {
        res.locals.authenticated=false;
        next();
    }

})

app.get('/signup', function (req, res,next) {
    res.render('signup');
});
app.post('/signup',function (req, res, next) {


//    console.log(req.body.user);
    var user=new User(req.body.user);
    user.save(function (err) {
//        console.log(user.email);
        if(err)return next(err);

        res.redirect('/login'+"?signupEmail="+user.email);
    })
});
app.get('/login',function (req,res) {
//    console.log(req.query.signupEmail);
    res.render('login',{signupEmail:req.query.signupEmail})

});
app.post('/login',function (req,res) {
    User.findOne({email:req.body.user.email,password:req.body.user.password},function (err,doc) {
        if(err)return next(err);
        if(!doc)return res.send('<p>User not found. Go back and try again');
 //       console.log(req.session);
        req.session.loggedIn = doc._id.toString();
        res.redirect('/');

    })

})
app.get('/',function (req, res, next) {
    res.render('index');

});
app.get('/logout',function (req,res) {
    req.session.loggedIn=null;
    res.render('index');
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



mongoose.connect('mongodb://127.0.0.1:27017/my-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
var Schema = mongoose.Schema;
User = mongoose.model('User', new Schema({
    first: String,
    last: String,
    email: {type: String, unique: true},
    password: {type: String, index: true}
}));

app.listen(3000);
console.log('listen 3000');
module.exports = app;

