const bcrypt = require('bcryptjs')
const validator = require('validator')

exports.getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

exports.encryptPassword = (_pass) => {
  return bcrypt.hash(_pass, 12)
}

exports.matchPassword = (_pass1, _pass2) => {
  return bcrypt.compare(_pass1, _pass2)
}

exports.validateCustomerRegistrationData = (_data) => {
  const errors = []

  if(!validator.isEmail(_data.customerEmail)){
    errors.push({message: 'invalid email'})
  }

  return errors
}