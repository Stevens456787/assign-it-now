
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentCredentialFields from './PaymentCredentialFields';

interface PaymentSectionProps {
  amount: number;
  setAmount: (amount: number) => void;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  setPaymentMethod: (method: 'credit_card' | 'paypal' | 'bank_transfer') => void;
  // Credit Card fields
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvc: string;
  setCardCvc: (value: string) => void;
  // PayPal fields
  paypalEmail: string;
  setPaypalEmail: (value: string) => void;
  // Bank Transfer fields
  bankName: string;
  setBankName: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  routingNumber: string;
  setRoutingNumber: (value: string) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  // Credit Card fields
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  // PayPal fields
  paypalEmail,
  setPaypalEmail,
  // Bank Transfer fields
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  routingNumber,
  setRoutingNumber
}) => {
  return (
    <div className="border-t pt-4 mt-4">
      <Label className="text-lg font-semibold">Payment Information</Label>
      
      <div className="mt-3">
        <Label htmlFor="amount">Assignment Fee ($)</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="mt-2"
        />
      </div>
      
      <PaymentMethodSelector 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
      />
      
      <PaymentCredentialFields
        paymentMethod={paymentMethod}
        creditCardFields={paymentMethod === 'credit_card' ? {
          cardNumber,
          setCardNumber,
          cardExpiry,
          setCardExpiry,
          cardCvc,
          setCardCvc
        } : undefined}
        paypalFields={paymentMethod === 'paypal' ? {
          paypalEmail,
          setPaypalEmail
        } : undefined}
        bankTransferFields={paymentMethod === 'bank_transfer' ? {
          bankName,
          setBankName,
          accountNumber,
          setAccountNumber,
          routingNumber,
          setRoutingNumber
        } : undefined}
      />
    </div>
  );
};

export default PaymentSection;
