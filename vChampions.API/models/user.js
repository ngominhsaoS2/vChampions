const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
let Validator = require("fastest-validator");
let v = new Validator();

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    roles: [
        {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        }
    ],
    avatar: {
        publicId: { type: String, default: '' },
        version: { type: String, default: '' }
    },
    clubs: [
        {
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
                logo: {
                    publicId: { type: String, default: '' },
                    version: { type: String, default: '' }
                },
                titleOfUser: {
                    type: String,
                    required: true,
                    default: 'player',
                    minlength: 5,
                    maxlength: 50
                },
                confirmation: {
                    type: String,
                    required: true,
                    minlength: 5,
                    maxlength: 50
                }
            })
        }
    ],
    images: [
        {
            publicId: { type: String, default: '' },
            version: { type: String, default: '' }
        }
    ],
    birthday: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false,
        minlength: 5,
        maxlength: 200
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, roles: this.roles }, config.get('jwtPrivateKey'), { expiresIn: '24h' });
    return token;
}

const User = mongoose.model('Users', userSchema);

function validateUser(user) {
    const schema = {
        name: { type: "string", empty: false, min: 5, max: 50 }, // empty: false - tức là không cho trường name empty
        email: { type: "email", empty: false, min: 5, max: 255 },
        phone: { type: "string", empty: false, min: 10, max: 12 },
        password: { type: "string", empty: false, min: 5, max: 255 },
        description: { type: "string", empty: true, optional: true, min: 5, max: 255 }, // optional: true - tức là trường description không bắt buộc nhập
        roles: { type: "array", items: "string" }
      };
    
      return v.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;