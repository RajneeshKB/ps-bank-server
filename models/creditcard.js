const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
  creditCardType: {
    type: String,
    required: true,
  },
  cardholderId: {
    type: String,
    required: true,
  },
  creditCardNumber: {
    type: String,
    required: true,
  },
  validFrom: {
    type: String,
    required: true,
  },
  validTo: {
    type: String,
    required: true,
  },
  cvvNumber: {
    type: String,
    required: true,
  },
  availableLimit: {
    type: String,
    required: true,
  },
  outstandingAmount: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("CreditCard", creditCardSchema);
