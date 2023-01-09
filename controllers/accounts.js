const jwt = require('jsonwebtoken')
const Customer = require('../models/customers')
const Account = require('../models/accounts')
const Nominee = require('../models/nominee')
const { getRandomIntInclusive, encryptPassword, matchPassword, validateCustomerRegistrationData } = require('../util')

const getUniqueAccountNumber = async () => {
	const newAccountNumber = getRandomIntInclusive(1234567890, 9876543210)
	const existingAccount = await Account.findOne({accountNumber: newAccountNumber})
	if(existingAccount) {
		getUniqueAccountNumber()
	}

	return newAccountNumber;
}

const getUniqueDebitCardNumber = async () => {
	const newDebitCardNumber = getRandomIntInclusive(1234567890123456, 9876543210987654)
	const existingDebitCard = await Account.findOne({activeDebitCard: newDebitCardNumber})
	if(existingDebitCard) {
		getUniqueDebitCardNumber()
	}

	return newDebitCardNumber;	
}

exports.openNewAccountToDb = async ({accountData}, req) => {
	if(!req.isAuth) {
		const error = new Error('Invalid access token')
		error.code = 401
		throw error
	}
	if(accountData.customerId !== req.customerId){
		const error = new Error('Access token for customer do not match')
		error.code = 401
		throw error
	}

	try{
		let newCustomerId = `PS_${getRandomIntInclusive(123456, 987654)}`
		const existingCustomer = await Customer.findOne({customerId: newCustomerId})
		if(existingCustomer) {
			openNewAccountToDb({accountData})
		}
		const defaullPassword = await encryptPassword("pass123");
		const newAccountNumber = await getUniqueAccountNumber()
		const newDebitCardNumber = await getUniqueDebitCardNumber()
		const currentMonth = new Date().getMonth()
		const currentYear = new Date().getFullYear()
		const validFromDate = `${currentMonth + 1}/${currentYear}`
		const validToDate = `${currentMonth + 1}/${currentYear + 4}`
		const uniqueCvvNumber = getRandomIntInclusive(123,987)

		const {
			customerId,
			savingAccountType,
			isJointAccount,
			joint_customerName,
			joint_customerEmail,
			joint_customerMob,
			joint_dateOfBirth,
			joint_genderType,
			joint_fathersName,
			joint_mothersName,
			joint_addressLine1,
			joint_addressLine2,
			joint_city,
			joint_pincode,
			joint_state,
			joint_country,
			joint_occupation,		
			joint_income,
			joint_panNumber,
			joint_aadharNumber,
			joint_relationship,
			nominee_customerName,
			nominee_dateOfBirth,
			nominee_genderType,
			nominee_fathersName,
			nominee_mothersName,
			nominee_aadharNumber,
			nominee_relationship,
			initialDeposit,
			paymentMethod
		} = accountData

		const joinCustomerData = new Customer({
			customerName: joint_customerName,
			customerEmail: joint_customerEmail,
			customerMob: joint_customerMob,
			dateOfBirth: joint_dateOfBirth,
			genderType: joint_genderType,
			fathersName: joint_fathersName,
			mothersName: joint_mothersName,
			addressLine1: joint_addressLine1,
			addressLine2: joint_addressLine2,
			city: joint_city,
			pincode: joint_pincode,
			state: joint_state,
			country: joint_country,
			occupation: joint_occupation,		
			income: joint_income,
			panNumber: joint_panNumber,
			aadharNumber: joint_aadharNumber, 
			customerId: newCustomerId, 
			password: defaullPassword, 
			isNewUser: true
		})
		const nomineeData = new Nominee({
			customerId: `${customerId}_1`,
			customerName: nominee_customerName,
			dateOfBirth: nominee_dateOfBirth,
			genderType: nominee_genderType,
			fathersName: nominee_fathersName,
			mothersName: nominee_mothersName,
			aadharNumber: nominee_aadharNumber,
		})
		const accountOpenFormData = new Account({
			accountNumber: newAccountNumber,
			accountType: savingAccountType,
			primaryHolderId: customerId,
			isJointAccount: isJointAccount,
			jointHolderId: isJointAccount ? newCustomerId : '',
			jointRelationship: isJointAccount ? joint_relationship : '',
			nomineeId: `${customerId}_1`,
			availableBalance: initialDeposit,
			activeDebitCard: newDebitCardNumber,
			validFrom: validFromDate,
			validTo: validToDate,
			cvvNumber: uniqueCvvNumber
		})

		if(isJointAccount){
			await joinCustomerData.save()			
		}
		await nomineeData.save()
		await accountOpenFormData.save()

		return {
			accountNumber: newAccountNumber
		}
	}catch(e){
		console.log('cought expection while creating customer', e)
		const error = new Error('invalid form data')
		throw error
	}
}

// const getMoreAccountDetails = async (accFound, result) => {
// 	return accFound.forEach(async (acc)=>{
// 		const nomineeData = await Nominee.findOne({customerId: acc.nomineeId})
// 		const nomineeName = nomineeData.customerName
// 		let jointHolderName = ''
// 		if(acc.isJointAccount){
// 			const customerData = await Customer.findOne({customerId: acc.jointHolderId})
// 			jointHolderName = customerData.customerName
// 		}
// 		console.log('result before', result)
// 		result.push({...acc, nomineeName, jointHolderName})
// 		console.log('result after', result)
// 	})
// }
exports.getAccountsFromDb = async ({customerId}, req) => {
	if(!req.isAuth) {
		const error = new Error('Invalid access token')
		error.code = 401
		throw error
	}
	if(customerId !== req.customerId){
		const error = new Error('Access token for customer do not match')
		error.code = 401
		throw error
	}
	const accFound = await Account.find({primaryHolderId: customerId})
	if(!accFound){
		throw new Error('data mismatch')
	}

	return accFound
}


