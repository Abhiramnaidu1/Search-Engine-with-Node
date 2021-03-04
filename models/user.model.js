const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: ('Full name can\'t be empty')
    },
    email: {
        type: String,
        required: ('Email can\'t be empty'),
        unique: true
    },
    password: {
        type: String,
        required: ('Password can\'t be empty'),
        minlength : [4,('Password must be atleast 4 character long')]
    },
    conf_password: String,
    saltSecret: String,
reset_password_token:  String,
reset_password_expire: Date
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// encrypting password and save
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});

//decrypting password and verification
userSchema.methods.verifyPassword = function (password) {
  console.log('password inside');
    return bcrypt.compareSync(password, this.password);
};
//generating JWT token
userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}


mongoose.model('User', userSchema);
