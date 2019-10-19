const Joi = require('joi');
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  }
});

const Role = mongoose.model('Roles', roleSchema);

function validateRole(role) {
  const schema = {
    name: Joi.string().min(3).max(50).required()
  };

  return Joi.validate(role, schema);
}

exports.roleSchema = roleSchema;
exports.Role = Role; 
exports.validateRole = validateRole;