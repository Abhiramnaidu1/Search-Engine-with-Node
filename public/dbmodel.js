const mongoose = require("mongoose");

var userschema = new.mongoose.Schema({
  Name: {
    type:String
  },
  Email:{
    type:String
  },
  Password:{
    type:String
  },
  saltSecret: String
});
mongoose.model(user,userschema);
