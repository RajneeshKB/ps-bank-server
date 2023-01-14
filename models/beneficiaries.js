const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const beneficiariesSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  beneficiaryName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Beneficiaries", beneficiariesSchema);
