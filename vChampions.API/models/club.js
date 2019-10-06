const Joi = require('joi');
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  logo: {
    imgId: { type: String, default: '' },
    imgVersion: { type: String, default: '' }
  },
  captain: {
    type: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 255,
            unique: true
        },
        phone: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 12,
            unique: true
        },
        avatar: {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
        },
        description: {
            type: String,
            required: false,
            minlength: 5,
            maxlength: 200
        }
    })
  },
  players: [
    {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            email: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
                unique: true
            },
            phone: {
                type: String,
                required: true,
                minlength: 10,
                maxlength: 12,
                unique: true
            },
            avatar: {
                imgId: { type: String, default: '' },
                imgVersion: { type: String, default: '' }
            },
            description: {
                type: String,
                required: false,
                minlength: 5,
                maxlength: 200
            }
        })
    }
  ]
});

const Club = mongoose.model('Club', clubSchema);

function validateClub(club) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    captainId: Joi.objectId().required(),
  };

  return Joi.validate(club, schema);
}

exports.clubSchema = clubSchema;
exports.Club = Club; 
exports.validateClub = validateClub;