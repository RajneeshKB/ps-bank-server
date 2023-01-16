const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// const notificationSchema = new Schema({
//   code: String,
//   message: String,
// });
const accountsSchema = new Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  primaryHolderId: {
    type: String,
    required: true,
  },
  isJointAccount: {
    type: Boolean,
    required: true,
  },
  jointHolderId: {
    type: String,
    required: false,
  },
  jointRelationship: {
    type: String,
    required: false,
  },
  nomineeId: {
    type: String,
    required: true,
  },
  availableBalance: {
    type: String,
    required: true,
  },
  activeDebitCard: {
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
});

module.exports = mongoose.model("Accounts", accountsSchema);
