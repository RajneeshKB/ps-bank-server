const dayjs = require("dayjs");
const CreditCard = require("../models/creditcard");
const { getRandomIntInclusive } = require("../util");

const getUniqueCreditCardNumber = async () => {
  const newCreditCardNumber = getRandomIntInclusive(
    1234567890123456,
    9876543210987654
  );
  const existingCreditCard = await CreditCard.findOne({
    creditCardNumber: newCreditCardNumber,
  });
  if (existingCreditCard) {
    getUniqueCreditCardNumber();
  }

  return newCreditCardNumber;
};

exports.issueNewCreditCardToDb = async ({ creditCardData }, req) => {
  if (!req.isAuth) {
    const error = new Error("Invalid access token");
    error.code = 401;
    throw error;
  }
  if (creditCardData.customerId !== req.customerId) {
    const error = new Error("Access token for customer do not match");
    error.code = 401;
    throw error;
  }

  try {
    const newCreditCardNumber = await getUniqueCreditCardNumber();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const validFromDate = `${currentMonth + 1}/${currentYear}`;
    const validToDate = `${currentMonth + 1}/${currentYear + 4}`;
    const uniqueCvvNumber = getRandomIntInclusive(123, 987);
    const { customerId, creditCardType } = creditCardData;
    const limit = creditCardType === "gold" ? "50000" : "150000";
    const newCreditCardData = new CreditCard({
      creditCardType: creditCardType,
      cardholderId: customerId,
      creditCardNumber: newCreditCardNumber,
      validFrom: validFromDate,
      validTo: validToDate,
      cvvNumber: uniqueCvvNumber,
      availableLimit: limit,
      outstandingAmount: "0",
    });

    await newCreditCardData.save();

    return {
      creditCardNumber: newCreditCardNumber,
    };
  } catch (e) {
    const error = new Error("invalid form data");
    throw error;
  }
};

exports.getCreditCardFromDb = async ({ customerId }, req) => {
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

  const cardsList = await CreditCard.find({ cardholderId: customerId });
  if (!cardsList) {
    throw new Error("data mismatch");
  }

  const updatedCardsList = cardsList.map((card) => {
    let notifications = [];
    const dueDatePassed = dayjs().isAfter(card.dueDate);

    if (+card.outstandingAmount > 0 && dueDatePassed) {
      notifications.push({
        code: "110",
        message:
          "Payment due date passed. Pay outstanding amount to avoid late charges",
      });
    }
    return { ...card._doc, notifications: notifications };
  });

  return updatedCardsList;
};
