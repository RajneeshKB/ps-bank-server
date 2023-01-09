const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionsSchema = new Schema({
	// transactionId: {
	// 	type: String,
	// 	required: true
	// },
	accountNumber: {
		type: String,
		required: true
	},
	transactionDate: {
		type: String,
		required: true
	},
	transactionRemark: {
		type: String,
		required: true
	},
	transactionAmount: {
		type: String,
		required: true
	},
	transactionType: {
		type: String,
		required: true
	},
	openingBalance: {
		type: String,
		required: true
	},
	closingBalance: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Transaction', transactionsSchema);