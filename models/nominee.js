const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nomineeSchema = new Schema({
	customerId: {
		type: String,
		required: true
	},
	customerName: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: String,
		required: true
	},
	genderType: {
		type: String,
		required: true
	},
	fathersName: {
		type: String,
		required: true
	},
	mothersName: {
		type: String,
		required: true
	},
	aadharNumber: {
		type: String,
		required: false
	}
});

module.exports = mongoose.model('Nominee', nomineeSchema);