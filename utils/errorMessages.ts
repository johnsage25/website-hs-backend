const errorMessages = [
  {
    code: "card_declined",
    message:
      "Sorry, your card has been declined. Please check your card information and try again or contact your bank for assistance.",
  },
  {
    code: "generic_decline",
    message:
      "Sorry, your card has been declined. Please check your card information and try again or contact your bank for assistance.",
  },
  {
    code: "incorrect_number",
    message:
      "The card number is incorrect. Please double-check the number and try again.",
  },
  {
    code: "invalid_expiry_month",
    message:
      "The expiration month is invalid. Please double-check the date and try again.",
  },
  {
    code: "invalid_expiry_year",
    message:
      "The expiration year is invalid. Please double-check the date and try again.",
  },
  {
    code: "incorrect_cvc",
    message:
      "The CVC number is invalid. Please double-check the number and try again.",
  },
  {
    code: "expired_card",
    message:
      "We're sorry, but we were unable to process your payment with the provided card information. Please double-check the details you entered and try again. If the issue persists, please contact your bank or card issuer for assistance.",
  },
  {
    code: "insufficient_funds",
    message:
      "There are insufficient funds on your card to complete this transaction. Please use a different card or contact your bank for assistance.",
  },
  {
    code: "processing_error",
    message:
      "An error occurred while processing your payment. Please try again later or contact us for assistance.",
  }
];

export { errorMessages };
