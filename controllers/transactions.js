const Transaction = require("../models/transactions");
const Account = require("../models/accounts");

exports.transferMoneyUpdateDb = async ({ transactionDetails }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  const {
    customerId,
    transferType,
    fromAccount,
    toAccount,
    transferAmount,
    transferRemarks,
  } = transactionDetails;

  if (customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }

  try {
    const accountData = await Account.findOne({ accountNumber: fromAccount });
    if (!accountData) {
      throw new Error("invalid account number");
    }
    let toAccountData;
    if (transferType === "within") {
      toAccountData = await Account.findOne({ accountNumber: toAccount });
      if (!toAccountData) {
        throw new Error("invalid account number");
      }
    }

    console.log("got from account", accountData);
    const openingBalanceForFromAccount = +accountData.availableBalance;
    if (transferAmount > openingBalanceForFromAccount) {
      throw new Error("invalid sufficient amount");
    }

    /** Update balance in from account */
    const closingBalanceForFromAccount =
      openingBalanceForFromAccount - +transferAmount;

    console.log(
      "got balance for from data",
      openingBalanceForFromAccount,
      closingBalanceForFromAccount
    );
    const updateResponse = await Account.findOneAndUpdate(
      { accountNumber: fromAccount },
      { availableBalance: closingBalanceForFromAccount },
      { new: true }
    );
    if (!updateResponse?.availableBalance === closingBalanceForFromAccount) {
      throw new Error("something went wrong while updating account");
    }

    /** Add transaction details for from account*/
    const currentDate = new Date().toDateString();
    const fromTransactionData = {
      accountNumber: fromAccount,
      transactionDate: currentDate,
      transactionRemark: `transferred ${transferRemarks}`,
      transactionAmount: transferAmount,
      transactionType: "debit",
      openingBalance: accountData.availableBalance,
      closingBalance: closingBalanceForFromAccount.toString(),
    };
    console.log("transaction data formed", fromTransactionData);
    const fromTransaction = new Transaction(fromTransactionData);
    await fromTransaction.save();

    /** Update balance in to account */
    if (transferType === "within") {
      const openingBalanceForToAccount = +toAccountData.availableBalance;
      const closingBalanceForToAccount =
        openingBalanceForToAccount + +transferAmount;
      const updateResponseNew = await Account.findOneAndUpdate(
        { accountNumber: toAccount },
        { availableBalance: closingBalanceForToAccount },
        { new: true }
      );
      if (!updateResponseNew?.availableBalance === closingBalanceForToAccount) {
        throw new Error("something went wrong while updating account");
      }

      /** Add transaction details for to account*/
      const toTransactionData = {
        accountNumber: toAccount,
        transactionDate: currentDate,
        transactionRemark: `deposited ${transferRemarks}`,
        transactionAmount: transferAmount,
        transactionType: "credit",
        openingBalance: toAccountData.availableBalance,
        closingBalance: closingBalanceForFromAccount.toString(),
      };
      const toTransaction = new Transaction(toTransactionData);
      await toTransaction.save();
    }

    return "SUCCESS";
  } catch (e) {
    const error = new Error("invalid form data");
    throw error;
  }
};

exports.getTransactionsFromDb = async ({ filterData }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  const {
    customerId,
    accountNumber,
    lastTenTransactions = true,
    fromDate,
    toDate,
    page,
    pageSize,
  } = filterData;
  if (!customerId || !accountNumber) {
    throw new Error("invalid filter params");
  }
  if (!lastTenTransactions && (!fromDate || !toDate)) {
    throw new Error("invalid filter params");
  }

  const currentPage = page || 0;
  const perPageData = pageSize || 10;
  if (customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }

  const allTransactions = await Transaction.find({
    accountNumber: accountNumber,
  }).sort({ _id: -1 });
  const transactionsFound = await Transaction.find({
    accountNumber: accountNumber,
  })
    .sort({ _id: -1 })
    .skip(currentPage * perPageData)
    .limit(perPageData);
  return {
    totalRowCount: allTransactions?.length,
    transactions: transactionsFound,
  };
};
