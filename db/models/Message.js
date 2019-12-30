const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        message: {
          type: String,
          required:true
        },
        username: {
          type: String,
          required:true
        },
        date: {
            type: Date,
            default: Date.now()
        }  
    }, 
    { 
      versionKey: false
    }
  );

  MessageSchema.pre('save', next => {
    if(!this.date) {
      this.date = new Date();
    }
    next();
  });
  
  module.exports = mongoose.model('messages', MessageSchema);