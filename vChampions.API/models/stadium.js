const mongoose = require('mongoose');
let Validator = require("fastest-validator");
let v = new Validator();

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  owners: [
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
        }
      })
    }
  ],
  images: [
    {
      imgId: { type: String, default: '' },
      imgVersion: { type: String, default: '' }
    }
  ],
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  yards: [
    {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50
        },
        isReserved: {
          type: Boolean,
          required: false,
          default: false
        },
        homeClub: {
          type: new mongoose.Schema({
            code: {
              type: String,
              required: true,
              minlength: 3,
              maxlength: 50
            },
            name: {
              type: String,
              required: true,
              minlength: 3,
              maxlength: 50
            },
            logo: {
              imgId: { type: String, default: '' },
              imgVersion: { type: String, default: '' }
            }
          })
        },
        visitingClub: {
          type: new mongoose.Schema({
            code: {
              type: String,
              required: true,
              minlength: 3,
              maxlength: 50
            },
            name: {
              type: String,
              required: true,
              minlength: 3,
              maxlength: 50
            },
            logo: {
              imgId: { type: String, default: '' },
              imgVersion: { type: String, default: '' }
            }
          })
        },
        realtimeUpdate: {
          type: String,
          required: false,
          minlength: 5,
          maxlength: 200,
          default: 'Not updated yet'
        }
      })
    }
  ],
  prices: [
    {
      from: {
        type: Date,
        required: true,
        default: Date.now
      },
      to: {
        type: Date,
        required: true,
        default: Date.now
      },
      price: {
        type: Number,
        min: 0
      }
    }
  ]
});

const Stadium = mongoose.model('Stadiums', stadiumSchema);

async function validateStadium(stadium) {
  const schema = {
    name: { type: "string", empty: false, min: 3, max: 50 },
    address: { type: "string", empty: false, min: 5, max: 500 },
    yards: {
      type: "array", items: {
        type: "object", props: {
          name: { type: "string", empty: false, min: 3, max: 50 },
        }
      }
    }
  };

  return v.validate(stadium, schema);
}

async function validateYards(yards) {
  const schema = {
    yards: {
      type: "array", items: {
        type: "object", props: {
          name: { type: "string", empty: false, min: 3, max: 50 },
        }
      }
    }
  };

  return v.validate(yards, schema);
}

exports.stadiumSchema = stadiumSchema;
exports.Stadium = Stadium;
exports.validateStadium = validateStadium;