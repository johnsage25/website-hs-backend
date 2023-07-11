export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      card_type: string;
      bank: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      metadata: any;
    };
    plan: any;
    split: any;
    fees: number;
    transaction_date: string;
  };
}
