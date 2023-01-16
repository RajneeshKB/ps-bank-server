const { buildSchema } = require("graphql");

module.exports = buildSchema(`
	type CustomerData {
		customerId: ID!
		customerEmail: String!
	  	customerMob: String!
	  	customerName: String!
	  	dateOfBirth: String!,
	  	genderType: String!,
	  	fathersName: String!,
	  	mothersName: String!,
	  	occupation: String!
	  	income: String!
	  	panNumber: String!
	  	aadharNumber: String!
	  	addressLine1: String!
	  	addressLine2: String
	  	city: String!
	  	pincode: String!
	  	state: String!
	  	country: String!
	}

	type Customer {
		customerId: ID!
		customerName: String!
	}
	type CustomerLogin {
		customerId: ID
		customerName: String
		AccessToken: String
		isNewUser: Boolean
		message: String
	}
	type PasswordResetReturnType {
		message: String
	}

	input CustomerRegistrationData {
	  customerEmail: String!
	  customerMob: String!
	  customerName: String!
	  dateOfBirth: String!,
	  genderType: String!,
	  fathersName: String!,
	  mothersName: String!,
	  occupation: String!
	  income: String!
	  panNumber: String!
	  aadharNumber: String!
	  addressLine1: String!
	  addressLine2: String
	  city: String!
	  pincode: String!
	  state: String!
	  country: String!
	}
	input CustomerLoginData {
		customerId: String!
		password: String!
	}
	input PasswordResetData {
		customerId: ID
		oldPassword: String
		newPassword: String
	}

	type NewAccount {
		accountNumber: String
	}
	type CustomNotification {
		code: String!
		message: String!
	}
	type AccountsData {
		accountNumber: String!,
		accountType: String!,
		primaryHolderId: String!
		isJointAccount: Boolean!
		jointHolderId: String!,
		jointRelationship: String!,
		nomineeId: String!,
		availableBalance: String!,
		activeDebitCard: String!,
		validFrom: String!,
		validTo: String!,
		cvvNumber: String!
		notifications: [CustomNotification]!
	}
	input AccountOpeningData {
		savingAccountType: String!,
		customerId: String!,
		customerEmail: String!,
		customerMob: String!,
		customerName: String!,
		dateOfBirth: String!,
		genderType: String!,
		fathersName: String!,
		mothersName: String!,
		addressLine1: String!,
		addressLine2: String!,
		city: String!,
		pincode: String!,
		state: String!,
		country: String!,
		occupation: String!,
		income: String!,
		aadharNumber: String!,
		panNumber: String!,
		isJointAccount: Boolean!,
		joint_customerName: String,
		joint_customerEmail: String,
		joint_customerMob: String,
		joint_dateOfBirth: String,
		joint_genderType: String,
		joint_fathersName: String,
		joint_mothersName: String,
		joint_addressLine1: String,
		joint_addressLine2: String,
		joint_city: String,
		joint_pincode: String,
		joint_state: String,
		joint_country: String,
		joint_occupation: String,		
		joint_income: String,
		joint_panNumber: String,
		joint_aadharNumber: String,
		joint_relationship: String,
		nominee_customerName: String!,
		nominee_dateOfBirth: String!,
		nominee_genderType: String!,
		nominee_fathersName: String!,
		nominee_mothersName: String!,
		nominee_aadharNumber: String,
		nominee_relationship: String!,
		initialDeposit: String!,
		paymentMethod: String!
	}

	type NewCreditCard {
		creditCardNumber: String
	}
	type CreditCardData {
		creditCardType: String!,
		cardholderId: String!,
		creditCardNumber: String!,
		validFrom: String!,
		validTo: String!,
		cvvNumber: String!,
		availableLimit: String!,
		outstandingAmount: String!
		dueDate: String
		notifications: [CustomNotification]!
	}
	input CreditCardApplicationData {
		customerId: String!,
		creditCardType: String!,
	}

	input FetchTransactionData {
		customerId: String!,
		accountNumber: String!,
		lastTenTransactions: Boolean,
		fromDate: String,
		toDate: String,
		page: Int,
		pageSize: Int
	}
	type TransactionData {
		transactionDate: String!,
		transactionRemark: String!,
		transactionAmount: String!,
		transactionType: String!,
		openingBalance: String!,
		closingBalance: String!
	}
	type FilterReturnData {
		totalRowCount: Int,
		transactions: [TransactionData]
	}
	input DepositDetail {
		customerId: String!,
		accountNumber: String!,
		amount: String!,
	}
	input TransactionDetail {
		customerId: String!,
		transferType: String!,
		fromAccount: String!,
		toAccount: String!,
		transferAmount: String!,
		transferRemarks: String,
	}
	type Beneficiary {
		bankName: String!
		beneficiaryName: String!
		accountNumber: String!
	}
	input BeneficiaryDetails {
		bankName: String!
		  beneficiaryName: String!
		  accountNumber: String!
		  customerId: String!
	}

	type RootQuery {
		loginCustomer(customerData: CustomerLoginData): CustomerLogin
		resetPassword(customerData: PasswordResetData): PasswordResetReturnType
		getCustomerDetails(customerId: String): CustomerData
		getAccounts(customerId: String): [AccountsData]
		getCreditCards(customerId: String): [CreditCardData]
		getTransactions(filterData: FetchTransactionData): FilterReturnData
		getAllBeneficiaries(customerId: String): [Beneficiary]
	}
	type RootMutation {
		createCustomer(customerData: CustomerRegistrationData):Customer
		openNewAccount(accountData: AccountOpeningData): NewAccount
		issueNewCreditCard(creditCardData: CreditCardApplicationData): NewCreditCard
		depositMoney(depositDetails: DepositDetail): String
		transferMoney(transactionDetails: TransactionDetail): String
		addBeneficiary(beneficiaryDetails: BeneficiaryDetails): String
	}

	schema {
		query: RootQuery,
		mutation: RootMutation
	}
`);
