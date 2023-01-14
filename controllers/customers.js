const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = require("../util/constants");
const Customer = require("../models/customers");
const {
  getRandomIntInclusive,
  encryptPassword,
  matchPassword,
  validateCustomerRegistrationData,
} = require("../util");

exports.createNewCustomer = async ({ customerData }, req) => {
  try {
    const errorList = validateCustomerRegistrationData(customerData);
    if (!errorList.length) {
      let newCustomerId = `PS_${getRandomIntInclusive(123456, 987654)}`;
      const existingCustomer = await Customer.findOne({
        customerId: newCustomerId,
      });
      if (existingCustomer) {
        createNewCustomer({ customerData });
      }

      const defaullPassword = await encryptPassword("pass123");
      const customer = new Customer({
        ...customerData,
        customerId: newCustomerId,
        password: defaullPassword,
        isNewUser: true,
      });

      const createdCustomer = await customer.save();
      return {
        customerName: createdCustomer.customerName,
        customerId: createdCustomer.customerId,
      };
    }
  } catch (e) {
    console.log("cought expection while creating customer", e);
    const error = new Error("invalid form data");
    // error.data = errorList;
    // error.code = 400;
    throw error;
  }
};

exports.loginCustomerToDb = async ({
  customerData: { customerId, password },
}) => {
  const custFound = await Customer.findOne({ customerId: customerId });
  if (!custFound) {
    throw new Error("data mismatch");
  }
  const isMatch = await matchPassword(password, custFound.password);
  if (!isMatch) {
    throw new Error("data mismatch");
  }

  const AccessToken = jwt.sign(
    {
      customerId: custFound.customerId,
    },
    TOKEN_KEY,
    { expiresIn: "1h" }
  );

  return {
    customerId: custFound.customerId,
    customerName: custFound.customerName,
    isNewUser: custFound.isNewUser,
    AccessToken: AccessToken,
    message: "login successful",
  };
};

exports.resetCustomerPassword = async (
  { customerData: { customerId, oldPassword, newPassword } },
  req
) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  if (customerId !== req.customerId) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }

  const custFound = await Customer.findOne({ customerId: customerId });
  if (!custFound) {
    throw new Error("data mismatch");
  }
  const isMatch = await matchPassword(oldPassword, custFound.password);
  if (!isMatch) {
    throw new Error("data mismatch");
  }

  const encryptedNewPassword = await encryptPassword(newPassword);
  const updateResponse = await Customer.updateOne(
    { customerId: customerId },
    { $set: { password: encryptedNewPassword, isNewUser: false } },
    { new: true }
  );
  if (updateResponse?.modifiedCount) {
    return {
      message: "Password update successful",
    };
  }
  throw new Error("error occured while updating password");
};

exports.getCustomerDetailsFromDb = async ({ customerId }, req) => {
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

  const custFound = await Customer.findOne({ customerId: customerId });
  if (!custFound) {
    throw new Error("data mismatch");
  }

  return custFound;
};
