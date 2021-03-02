const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy( (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                    {console.log('inside 1');
                        return done(err);
                      }
                    // unknown user
                    else if (!user)
                    {console.log('inside 2');
                        return done(null, false, { message: 'Email is not registered' });
                      }
                    // wrong password
                    else if (!user.verifyPassword(password))
                    {console.log('inside 3');
                        return done(null, false, { message: 'Wrong password.' });
                      }
                    // authentication succeeded
                    else
                    {console.log('inside 1');
                        return done(null, user);
                      }
                });
        })
);
