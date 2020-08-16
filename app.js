const createError = require('http-errors');
const express = require('express'), mongodb = require('mongodb');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const app = express();
//const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
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
// app.use(bodyParser());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'my secret', resave: false,
    saveUninitialized: true
}));
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'my-website';

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client) {

    if (err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');
    const db = client.db(dbName);
    app.users = db.collection('users');
});

module.exports = app;



