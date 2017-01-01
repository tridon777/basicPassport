import * as Express from "express";
import * as eSession from "express-session";
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');



const login = Express();

let hardCodedUser = 'mdn';
let hardCodedPassword = 'word';
login.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
login.use(bodyParser.json()) // parse application/json
const user = {id:"mdn"};
console.log('test1');
passport.use(new Strategy(
  function(username, password, cb) {
      console.log('test12');
      if (username != hardCodedUser) { return cb(null, false); }
      if (password != hardCodedPassword) { return cb(null, false); }
      return cb(null, user);

  }));

  passport.serializeUser(function(user, cb) {
      console.log('test3');
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
console.log('test4');
    if (id == hardCodedUser){
        console.log('test5');
        cb(null, user);
    }


});


login.use(require('serve-static')(__dirname + '/../../public'));
login.use(eSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
login.use(passport.initialize());
login.use(passport.session());

login.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
      let options = { root: __dirname};
    res.sendFile('./mockup.html',options);
  });

login.get('/login', (req,res) => {
    let options = { root: __dirname};
    res.sendFile('./login.html',options);
})

const port = 82;

login.listen(port);