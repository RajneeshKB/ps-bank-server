const Beneficiaries = require("../models/beneficiaries");

exports.addBeneficiaryToDb = async ({ beneficiaryDetails }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  const { customerId, accountNumber, beneficiaryName, bankName } =
    beneficiaryDetails;

  if (customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }

  try {
    const accountData = await Beneficiaries.findOne({
      accountNumber: accountNumber,
    });
    if (accountData) {
      throw new Error("duplicate beneficiary account number");
    }

    const newData = {
      customerId,
      accountNumber,
      beneficiaryName,
      bankName,
    };
    const newBeneficaiary = new Beneficiaries(newData);

    await newBeneficaiary.save();

    return "SUCCESS";
  } catch (e) {
    console.log("cought expection while adding beneficiary", e);
    const error = new Error("invalid form data");
    throw error;
  }
};

exports.getBeneficiariesFromDb = async ({ customerId }, req) => {
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
  const beneficiaries = await Beneficiaries.find({ customerId: customerId });
  if (!beneficiaries) {
    throw new Error("data mismatch");
  }

  return beneficiaries;
};
