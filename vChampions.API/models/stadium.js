const mongoose = require('mongoose');
let Validator = require("fastest-validator");
let v = new Validator({
  messages: {
      // Register our new error message text
      validDateTimeMessage: "The '{field}' field must be a valid datetime! Actual: {actual}"
  }
});

// Register a custom 'validDateTime' validator
v.add('validDateTime', value => {
  if (new Date(value) == 'Invalid Date') {
    return v.makeError('validDateTimeMessage', null, value);
  }

  return true;
});

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
          publicId: { type: String, default: '' },
          version: { type: String, default: '' }
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
  logo: {
    publicId: { type: String, default: '' },
    version: { type: String, default: '' }
  },
  images: [
    {
      publicId: { type: String, default: '' },
      version: { type: String, default: '' }
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
              publicId: { type: String, default: '' },
              version: { type: String, default: '' }
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
              publicId: { type: String, default: '' },
              version: { type: String, default: '' }
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

async function validatePrices(prices) {
  const schema = {
    prices: {
      type: "array", items: {
        type: "object", props: {
          from: { type: "validDateTime" },
          to: { type: "validDateTime" },
          price: { type: "number", min: 0 }
        }
      }
    }
  };

  return v.validate(prices, schema);
}

exports.stadiumSchema = stadiumSchema;
exports.Stadium = Stadium;
exports.validateStadium = validateStadium;
exports.validateYards = validateYards;
exports.validatePrices = validatePrices;