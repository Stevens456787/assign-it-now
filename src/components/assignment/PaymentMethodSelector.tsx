
import React from 'react';
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Building } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer';

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: PaymentMethodType) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  paymentMethod, 
  setPaymentMethod 
}) => {
  return (
    <div className="mt-3">
      <Label>Payment Method</Label>
      <RadioGroup 
        value={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as PaymentMethodType)}
        className="mt-2 space-y-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
          <RadioGroupItem value="credit_card" id="credit_card" />
          <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
            <CreditCard className="h-4 w-4 mr-2" />
            Credit Card
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center cursor-pointer">
            <DollarSign className="h-4 w-4 mr-2" />
            PayPal
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50">
          <RadioGroupItem value="bank_transfer" id="bank_transfer" />
          <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
            <Building className="h-4 w-4 mr-2" />
            Bank Transfer
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
