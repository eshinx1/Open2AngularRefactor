var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db.js');
var tokens = require('../tokens.js')

router.get('/', function(req, res) {
  tokens.verify(req.headers.token, res)
})

router.post('/', function(req, res) {
  var userObj = req.body;
  var encPassword = bcrypt.hashSync(userObj.password, bcrypt.genSaltSync(10));

  db.query('SELECT 1 FROM Users WHERE username = ?', [userObj.username], function(err, results) {
    if(results.length === 0) {
      db.query('insert into Users (username, password, email, pic) values ("' + userObj.username + '", "' + encPassword +'", "' + userObj.email +'", "../../assets/default_profilePic.png")',
        function (err, results, fields) {
          if (err) {
            throw err;
          } else {
            console.log('success', results, fields);
            res.json({
              success: true,
              message: "Success! Created new user."
            })
          }
      });
    } else {
      console.log("Username Does Exist!", results)
      res.send({
        success: false,
        message: "Fail. Username already exists."
      });
    }
  });
});

router.post('/login', function(req, res) {
  var userObj = req.body;

  db.query('SELECT Users.username, Users.password, Users.id, Users.pic FROM Users WHERE Users.username =  ?', [userObj.username],
    function(err, results, fields) {
      if(err) {
        console.log("Users does not exist or Password is incorrect");
        res.json({
          success: false,
          message: "Users does not exist or Password is incorrect. Please Try again."
        });
      } else {
        var user = results[0];
        if(user !== undefined && bcrypt.compareSync(userObj.password, user["password"])) {

          console.log("Logging in now!")
          res.json({
            success: true,
            message: "Success! Logging in now.",
            userdata: {
              username: user["username"],
              id: user["id"],
              token: tokens.createToken({user: userObj.username}),
              pic: user["pic"]
            }
          })
        } else {
          console.log("Users does not exist or Password is incorrect");
          res.json({
            success: false,
            message: "Users does not exist or Password is incorrect"
          });
        }
      }
    })
});

module.exports = router;