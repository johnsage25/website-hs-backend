import { PaymentMethod } from "@stripe/stripe-js";

export interface VerifyCardBillingInterface {
  cardname?: string;
  tos?: boolean;
  country?: string;
  postalcode?: string;
  companyname?: string;
  state?: string;
  city?: string;
  address2?: string;
  paymentId?: string;
  address?: string;
}
