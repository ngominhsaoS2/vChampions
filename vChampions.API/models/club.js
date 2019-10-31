const mongoose = require('mongoose');
let Validator = require("fastest-validator");
let v = new Validator();

const clubSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  district: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 200
  },
  logo: {
    imgId: { type: String, default: '' },
    imgVersion: { type: String, default: '' }
  },
  manager: {
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
        maxlength: 255
      },
      phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 12
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
          maxlength: 255
        },
        phone: {
          type: String,
          required: true,
          minlength: 10,
          maxlength: 12
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
        },
        title: {
          type: String,
          required: true,
          default: 'player',
          minlength: 5,
          maxlength: 50
        },
        positions: [
          {
            type: String,
            required: false,
            minlength: 1,
            maxlength: 50
          }
        ],
        confirmation: {
          type: String,
          required: false,
          default: 'received',
          minlength: 5,
          maxlength: 50
        }
      })
    }
  ]
});

const Club = mongoose.model('Clubs', clubSchema);

async function validateClub(club) {
  const schema = {
    code: { type: "string", empty: false, min: 3, max: 50, pattern: /^\S*$/ }, // string phải theo đúng RegEx (không chứa dấu cách)
    name: { type: "string", empty: false, min: 3, max: 50 }, // empty: false - tức là không cho trường code empty
    city: { type: "string", empty: false, min: 3, max: 50 },
    district: { type: "string", empty: false, min: 3, max: 50 },
    managerId: { type: "string", empty: false, pattern: /^[0-9a-fA-F]{24}$/ }, // pattern objectId trong mongoDb
    players: {
      type: "array", items: {
        type: "object", props: {
          title: { type: "enum", values: ["player", "captain"] },
          positions: { type: "array", items: "string", enum: [ "GK", "DF", "MF", "FW" ] },
          confirmation: { type: "enum", values: ["received", "denined", "accepted"], optional: true }
        }
      }
    }
  };

  return v.validate(club, schema);
}

async function validatePlayers(players) {
  const schema = {
    players: {
      type: "array", items: {
        type: "object", props: {
          title: { type: "enum", values: ["player", "captain"] },
          positions: { type: "array", items: "string", enum: [ "GK", "DF", "MF", "FW" ] }
        }
      }
    }
  };

  return v.validate(players, schema);
}

exports.clubSchema = clubSchema;
exports.Club = Club;
exports.validateClub = validateClub;
exports.validatePlayers = validatePlayers;