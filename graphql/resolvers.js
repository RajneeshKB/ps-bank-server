const {
  createNewCustomer,
  loginCustomerToDb,
  resetCustomerPassword,
  getCustomerDetailsFromDb,
} = require("../controllers/customers");
const {
  getAccountsFromDb,
  openNewAccountToDb,
} = require("../controllers/accounts");
const {
  issueNewCreditCardToDb,
  getCreditCardFromDb,
} = require("../controllers/creditcard");
const {
  transferMoneyUpdateDb,
  getTransactionsFromDb,
} = require("../controllers/transactions");
const {
  addBeneficiaryToDb,
  getBeneficiariesFromDb,
} = require("../controllers/beneficiary");

module.exports = {
  createCustomer: createNewCustomer,
  loginCustomer: loginCustomerToDb,
  resetPassword: resetCustomerPassword,
  getCustomerDetails: getCustomerDetailsFromDb,
  getAccounts: getAccountsFromDb,
  openNewAccount: openNewAccountToDb,
  issueNewCreditCard: issueNewCreditCardToDb,
  getCreditCards: getCreditCardFromDb,
  transferMoney: transferMoneyUpdateDb,
  getTransactions: getTransactionsFromDb,
  addBeneficiary: addBeneficiaryToDb,
  getAllBeneficiaries: getBeneficiariesFromDb,
};
