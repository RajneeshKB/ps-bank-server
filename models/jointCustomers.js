const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jointCustomerSchema = new Schema({
  joint_customerId: {
    type: String,
    required: true,
  },
  joint_customerEmail: {
    type: String,
    required: true,
  },
  joint_customerMob: {
    type: String,
    required: true,
  },
  joint_customerName: {
    type: String,
    required: true,
  },
  joint_dateOfBirth: {
    type: Date,
    required: true,
  },
  joint_genderType: {
    type: String,
    required: true,
  },
  joint_fathersName: {
    type: String,
    required: true,
  },
  joint_mothersName: {
    type: String,
    required: true,
  },
  joint_occupation: {
    type: String,
    required: true,
  },
  joint_income: {
    type: String,
    required: true,
  },
  joint_panNumber: {
    type: String,
    required: true,
  },
  joint_aadharNumber: {
    type: String,
    required: true,
  },
  joint_addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: String,
  joint_city: {
    type: String,
    required: true,
  },
  joint_pincode: {
    type: String,
    required: true,
  },
  joint_state: {
    type: String,
    required: true,
  },
  joint_country: {
    type: String,
    required: true,
  },
  joint_password: {
    type: String,
    required: true,
  },
  joint_isNewUser: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("JointCustomer", jointCustomerSchema);
