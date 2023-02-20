var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./models/User');
require('./models/Tweet');
require('./config/passport'); 
const passport = require('passport'); 

const cors = require('cors');
const csurf = require('csurf');

require('./models/User');
const usersRouter = require('./routes/api/users');

const { isProduction } = require('./config/keys');

router.post('/register', async (req, res, next) => {
    // Check to make sure no one has already registered with the proposed email or
    // username.
    const user = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }]
    });

    if (user) {
        // Throw a 400 error if the email address and/or email already exists
        const err = new Error("Validation Error");
        err.statusCode = 400;
        const errors = {};
        if (user.email === req.body.email) {
            errors.email = "A user has already registered with this email";
        }
        if (user.username === req.body.username) {
            errors.username = "A user has already registered with this username";
        }
        err.errors = errors;
        return next(err);
    }

    // Otherwise create a new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email
    });

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
            if (err) throw err;
            try {
                newUser.hashedPassword = hashedPassword;
                const user = await newUser.save();
                return res.json({ user });
            }
            catch (err) {
                next(err);
            }
        })
    });
});

// var indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const tweetsRouter = require('./routes/api/tweets');
const csrfRouter = require('./routes/api/csrf');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());


if (!isProduction) {
    app.use(cors());
}

const csurf = require('csurf');

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);


// app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);
app.use('/api/csrf', csrfRouter);


module.exports = app;

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
});

const serverErrorLogger = debug('backend:error');

app.use((err, req, res, next) => {
    serverErrorLogger(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        statusCode,
        errors: err.errors
    })
});

module.exports = app;
module.exports = router;
