const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
	customerId: {
		type: String,
		required: true
	},
	customerEmail: {
		type: String,
		required: true
	},
	customerMob: {
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
	occupation: {
		type: String,
		required: true
	},
	income: {
		type: String,
		required: true
	},
	panNumber: {
		type: String,
		required: true
	},
	aadharNumber: {
		type: String,
		required: true
	},
	addressLine1: {
		type: String,
		required: true
	},
	addressLine2: String,
	city: {
		type: String,
		required: true
	},
	pincode: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	isNewUser: {
		type: Boolean,
		required: true
	}
});

module.exports = mongoose.model('Customer', customerSchema);