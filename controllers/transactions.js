const jwt = require('jsonwebtoken')
const Customer = require('../models/customers')
const Transaction = require('../models/transactions')
const Account = require('../models/accounts')

exports.addNewTransactionToDb = async ({transactionDetails}, req) => {
	if(!req.isAuth) {
		const error = new Error('Invalid access token')
		error.code = 401
		throw error
	}
	const {
		customerId,
		accountNumber,
		transactionRemark,
		transactionAmount,
		transactionType
	} = transactionDetails

	if(customerId !== req.customerId){
		const error = new Error('Access token for customer do not match')
		error.code = 401
		throw error
	}

	try{
		const accountData = await Account.findOne({accountNumber: accountNumber})
		if(!accountData){
			throw new Error('invalid account number')
		}
		const openingBalance = +accountData.availableBalance
		console.log('accountdata is', accountData)
		const closingBalance = transactionType === 'debit' ? (openingBalance - +transactionAmount) : (openingBalance + +transactionAmount)
		const currentDate = new Date().toDateString()

		const updateResponse = await Account.findOneAndUpdate({accountNumber: accountNumber}, {availableBalance: closingBalance}, {new: true})
		if(!updateResponse?.availableBalance === closingBalance){
			throw new Error('account not found')
		}

		const newData = {
			accountNumber: accountNumber,
			transactionDate: currentDate,
			transactionRemark: transactionRemark,
			transactionAmount: transactionAmount,
			transactionType: transactionType,
			openingBalance: accountData.availableBalance,
			closingBalance: closingBalance.toString(),
		}
		const newTransactionData = new Transaction(newData)

		await newTransactionData.save()

		return 'SUCCESS'
	}catch(e){
		console.log('cought expection while adding transaction', e)
		const error = new Error('invalid form data')
		throw error
	}
}

exports.getTransactionsFromDb = async ({filterData}, req) => {
	if(!req.isAuth) {
		const error = new Error('Invalid access token')
		error.code = 401
		throw error
	}
	const {
		customerId,
		accountNumber,
		lastTenTransactions = true,
		fromDate,
		toDate,
		page,
		pageSize
	} = filterData	
	if(!customerId || !accountNumber){
		throw new Error('invalid filter params')
	}
	if(!lastTenTransactions && (!fromDate || !toDate)){
		throw new Error('invalid filter params')
	}

	const currentPage = page || 0
	const perPageData = pageSize || 10
	if(customerId !== req.customerId){
		const error = new Error('Access token for customer do not match')
		error.code = 401
		throw error
	}

	const allTransactions = await Transaction.find({accountNumber: accountNumber}).sort({_id:-1})
	const transactionsFound = await Transaction.find({accountNumber: accountNumber}).sort({_id:-1}).skip((currentPage) * perPageData).limit(perPageData)
	return {
		totalRowCount: allTransactions?.length,
		transactions: transactionsFound
	}
}