const Customer = require("../models/customers");
const Account = require("../models/accounts");
const Nominee = require("../models/nominee");
const Transaction = require("../models/transactions");
const { getRandomIntInclusive, encryptPassword } = require("../util");
const {
  ACCOUNT_TYPE_PREMIUM,
  MINIMUM_BALANCE_PREMIUM_ACCOUNT,
} = require("../util/constants");

const getUniqueAccountNumber = async () => {
  const newAccountNumber = getRandomIntInclusive(1234567890, 9876543210);
  const existingAccount = await Account.findOne({
    accountNumber: newAccountNumber,
  });
  if (existingAccount) {
    getUniqueAccountNumber();
  }

  return newAccountNumber;
};

const getUniqueDebitCardNumber = async () => {
  const newDebitCardNumber = getRandomIntInclusive(
    1234567890123456,
    9876543210987654
  );
  const existingDebitCard = await Account.findOne({
    activeDebitCard: newDebitCardNumber,
  });
  if (existingDebitCard) {
    getUniqueDebitCardNumber();
  }

  return newDebitCardNumber;
};

exports.openNewAccountToDb = async ({ accountData }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  if (accountData.customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }

  try {
    let newCustomerId = `PS_${getRandomIntInclusive(123456, 987654)}`;
    const existingCustomer = await Customer.findOne({
      customerId: newCustomerId,
    });
    if (existingCustomer) {
      openNewAccountToDb({ accountData });
    }
    const defaullPassword = await encryptPassword("pass123");
    const newAccountNumber = await getUniqueAccountNumber();
    const newDebitCardNumber = await getUniqueDebitCardNumber();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const validFromDate = `${currentMonth + 1}/${currentYear}`;
    const validToDate = `${currentMonth + 1}/${currentYear + 4}`;
    const uniqueCvvNumber = getRandomIntInclusive(123, 987);

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
      paymentMethod,
    } = accountData;

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
      isNewUser: true,
    });
    const nomineeData = new Nominee({
      customerId: `${customerId}_1`,
      customerName: nominee_customerName,
      dateOfBirth: nominee_dateOfBirth,
      genderType: nominee_genderType,
      fathersName: nominee_fathersName,
      mothersName: nominee_mothersName,
      aadharNumber: nominee_aadharNumber,
    });
    const accountOpenFormData = new Account({
      accountNumber: newAccountNumber,
      accountType: savingAccountType,
      primaryHolderId: customerId,
      isJointAccount: isJointAccount,
      jointHolderId: isJointAccount ? newCustomerId : "",
      jointRelationship: isJointAccount ? joint_relationship : "",
      nomineeId: `${customerId}_1`,
      availableBalance: initialDeposit,
      activeDebitCard: newDebitCardNumber,
      validFrom: validFromDate,
      validTo: validToDate,
      cvvNumber: uniqueCvvNumber,
    });

    if (isJointAccount) {
      await joinCustomerData.save();
    }
    await nomineeData.save();
    await accountOpenFormData.save();

    /** Add new transaction for initial deposit */
    const currentDate = new Date().toDateString();
    const newTransaction = {
      accountNumber: newAccountNumber,
      transactionDate: currentDate,
      transactionRemark: `initial depost`,
      transactionAmount: initialDeposit,
      transactionType: "credit",
      openingBalance: initialDeposit,
      closingBalance: initialDeposit,
    };
    const fromTransaction = new Transaction(newTransaction);
    await fromTransaction.save();

    return {
      accountNumber: newAccountNumber,
    };
  } catch (e) {
    const error = new Error("invalid form data");
    throw error;
  }
};

exports.getAccountsFromDb = async ({ customerId }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  if (customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }
  const accountList = await Account.find({ primaryHolderId: customerId });
  if (!accountList) {
    throw new Error("data mismatch");
  }

  const updatedAccountsList = accountList.map((account) => {
    let notifications = [];
    if (
      account.accountType === ACCOUNT_TYPE_PREMIUM &&
      account.availableBalance > MINIMUM_BALANCE_PREMIUM_ACCOUNT
    ) {
      notifications.push({
        code: "101",
        message: "Minimum balance not maintained. Pay now to avoid charges.",
      });
    }
    return { ...account._doc, notifications: notifications };
  });
  return updatedAccountsList;
};
