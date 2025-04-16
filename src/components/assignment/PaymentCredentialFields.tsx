
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CreditCardFieldsProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvc: string;
  setCardCvc: (value: string) => void;
}

interface PayPalFieldsProps {
  paypalEmail: string;
  setPaypalEmail: (value: string) => void;
}

interface BankTransferFieldsProps {
  bankName: string;
  setBankName: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  routingNumber: string;
  setRoutingNumber: (value: string) => void;
}

interface PaymentCredentialFieldsProps {
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  creditCardFields?: CreditCardFieldsProps;
  paypalFields?: PayPalFieldsProps;
  bankTransferFields?: BankTransferFieldsProps;
}

const PaymentCredentialFields: React.FC<PaymentCredentialFieldsProps> = ({
  paymentMethod,
  creditCardFields,
  paypalFields,
  bankTransferFields
}) => {
  switch (paymentMethod) {
    case 'credit_card':
      if (!creditCardFields) return null;
      return (
        <div className="space-y-4 mt-3">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={creditCardFields.cardNumber}
              onChange={(e) => creditCardFields.setCardNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cardExpiry">Expiration (MM/YY)</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                value={creditCardFields.cardExpiry}
                onChange={(e) => creditCardFields.setCardExpiry(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cardCvc">CVC</Label>
              <Input
                id="cardCvc"
                placeholder="123"
                value={creditCardFields.cardCvc}
                onChange={(e) => creditCardFields.setCardCvc(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      );
    case 'paypal':
      if (!paypalFields) return null;
      return (
        <div className="mt-3">
          <Label htmlFor="paypalEmail">PayPal Email</Label>
          <Input
            id="paypalEmail"
            type="email"
            placeholder="your@email.com"
            value={paypalFields.paypalEmail}
            onChange={(e) => paypalFields.setPaypalEmail(e.target.value)}
            className="mt-1"
          />
        </div>
      );
    case 'bank_transfer':
      if (!bankTransferFields) return null;
      return (
        <div className="space-y-4 mt-3">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="Enter bank name"
              value={bankTransferFields.bankName}
              onChange={(e) => bankTransferFields.setBankName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={bankTransferFields.accountNumber}
              onChange={(e) => bankTransferFields.setAccountNumber(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="routingNumber">Routing Number</Label>
            <Input
              id="routingNumber"
              placeholder="Enter routing number"
              value={bankTransferFields.routingNumber}
              onChange={(e) => bankTransferFields.setRoutingNumber(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default PaymentCredentialFields;
