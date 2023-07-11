const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function checkIfCustomerExists(customerId) {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      console.log(customer);

      if (customer.deleted) return false;

      return customer;
    } catch (error: any) {

      if (
        error.type === "StripeInvalidRequestError" &&
        error.statusCode === 404
      ) {
        return null; // customer doesn't exist
      } else {

        return false;
      }
    }
  }

  export default checkIfCustomerExists