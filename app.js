const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv').config()
const hbs = require('express-handlebars');
const handlebarsHelpers = require('handlebars-helpers')();

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const groupRouter = require('./routes/group');
const eventRouter = require('./routes/event')
const app = express();
const fileupload = require('express-fileupload');
const db = require('./config/db')
const { store } = require('./config/session')



// view engine setup
const hbsEngine = hbs.create({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    eq: handlebarsHelpers.eq, // register the 'eq' helper
    json: function (context) {
      return JSON.stringify(context);
    }
  }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbsEngine.engine)
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());
app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 * 6 } // six months 
}))

db.connect((err) => {
  if (err) console.log("Connection Error");
  else console.log('Database connected')
})

app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/group', groupRouter);
app.use('/event', eventRouter)


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

module.exports = app;
