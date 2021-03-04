const mongoose = require('mongoose');
const passport = require('passport');

const crypto =require('crypto');
const nodemailer = require('nodemailer');
const buf = require('buf');
const async = require('async');
const bcrypt = require('bcryptjs');
module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err, doc) => {
        if (!err)
            res.send(doc);
            function(token, user, done) {
                console.log('step 2')

              var smtpTrans = nodemailer.createTransport({
                 service: 'Gmail',
                 auth: {
                  user: 'abhiram.kankipati@gmail.com',
                  pass: 'Abhi@8885946996'
                }
              });
              console.log('step 3')

                smtpTrans.sendMail({
                  from: 'abhiram.kankipati@gmail.com',
                  to:user.email,
                  subject:'Account confirmation',
                  text:'Hi'+user.fullname+'\n\n'+'You are recieving this email as you have registered to Search Engine. click on below link to verify your email' +
                    'http://localhost:3000/verify.html?token=' + token + '\n\n' ,

                });
                console.log('Email Send');
        }
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);

            else
                return next(err);
        }

    });
}


module.exports.authenticate = (req, res, next) => {
   // call for passport authentication
   console.log('inside authenticate');
   passport.authenticate('local', (err, user, info) => {
     console.log('passport');
       // error from passport middleware
       if (err) return res.status(400).json(err);
       // registered user
       else if (user) return res.status(200).json({ "token": user.generateJwt() });
       // unknown user or wrong password
       else return res.status(404).json({ status: false, message: 'Invalid credentials.'
       });
   })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
   User.findOne({ _id: req._id },
       (err, user) => {
           if (!user)
               return res.status(404).json({ status: false, message: 'User record not found.'
               });

           else
               return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
       }
   );
}

module.exports.reset_token_verify=function(req, res,next) {
  console.log('Step 1');
  User.findOne({
  reset_password_token: req.params.token,
  reset_password_expire: {$gt: Date.now()}
})
.exec(function(err, user) {
  console.log ('step 2');
  console.log(req.params.token);
console.log(user);
  if (!err && user) {
    res.render("../../views/reset.ejs");
  }
});
}

//password reset
module.exports.reset_password= function(req, res,next) {
  console.log('Step 1');
  User.findOne({
  reset_password_token: req.body.token,
  reset_password_expire: {$gt: Date.now()}

});
console.log(body);
user.exec(function(err, user) {
  console.log ('step 2');
  console.log(req.body.token);
console.log(user);
  if (!err && user) {
    if (req.body.new_password === req.body.conf_password) {
      user.hash_password = bcrypt.hash(req.body.new_password, 10);
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;
      user.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: err
          });
        } else {
          var data = {
            to: user.email,
            from: 'myemail',
            subject: 'Password Reset Confirmation',
            text: 'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n',
          };

          smtpTransport.sendMail(data, function(err) {
            if (!err) {
              return res.json({ message: 'Password reset' });
            } else {
              return done(err);
            }
          });
        }
      });
    } else {
      return res.status(422).send({
        message: 'Passwords do not match'
      },);
    }
  } else {
    return res.status(400).send({
      message: 'Password reset token is invalid or has expired.'
    });
  }
});
};

//forgot password
module.exports.forgot_password= function(req, res){
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      console.log(req.body);
      User.findOne({ email: req.body.username }, function(err, user) {
        if (!user) {
          return res.json({status:false, message:'E-Mail not Found'})
        }
        console.log('step 1')
        user.reset_password_token = token;
        user.reset_password_expire = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
        done(err,token, user);
         });
      });
    },
    function(token, user, done) {
        console.log('step 2')

      var smtpTrans = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
          user: 'abhiram.kankipati@gmail.com',
          pass: 'Abhi@8885946996'
        }
      });
      console.log('step 3')

        smtpTrans.sendMail({
          from: 'abhiram.kankipati@gmail.com',
          to:user.email,
          subject:'Password Reset',
          text:'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://localhost:3000/reset.html?token=' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n',

        });
        console.log('Email Send');
}
  ], function(err) {
    console.log('this err' + ' ' + err)

  });
};
