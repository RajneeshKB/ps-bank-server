const { createNewCustomer, loginCustomerToDb, resetCustomerPassword, getCustomerDetailsFromDb } = require('../controllers/customers')
const { getAccountsFromDb, openNewAccountToDb } = require('../controllers/accounts')
const {issueNewCreditCardToDb, getCreditCardFromDb} = require('../controllers/creditcard')
const {addNewTransactionToDb, getTransactionsFromDb} = require('../controllers/transactions')

module.exports = {
	createCustomer: createNewCustomer,
	loginCustomer: loginCustomerToDb,
	resetPassword: resetCustomerPassword,
	getCustomerDetails: getCustomerDetailsFromDb,
	getAccounts: getAccountsFromDb,
	openNewAccount: openNewAccountToDb,
	issueNewCreditCard: issueNewCreditCardToDb,
	getCreditCards: getCreditCardFromDb,
	addNewTransaction: addNewTransactionToDb,
	getTransactions: getTransactionsFromDb
}