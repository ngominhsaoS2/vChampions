const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { roleSchema } = require('./role');

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
    role: { 
        type: roleSchema,  
        required: true
    },
    avatar: {
        imgId: { type: String, default: '' },
        imgVersion: { type: String, default: '' }
    },
    images: [
        {
            imgId: { type: String, default: '' },
            imgVersion: { type: String, default: '' }
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

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name: this.name, email: this.email, role: this.role }, config.get('jwtPrivateKey'), { expiresIn: '1h' });
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(10).max(12).required(),
        password: Joi.string().min(5).max(255).required(),
        roleId: Joi.objectId().required(),
        description: Joi.string().min(5).max(200)
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;