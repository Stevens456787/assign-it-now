
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssignmentForm from '@/components/assignment/AssignmentForm';
import PaymentSection from '@/components/assignment/PaymentSection';
import StatusMessage from '@/components/assignment/StatusMessage';
import { useAssignmentSubmission } from '@/components/assignment/useAssignmentSubmission';

const AssignmentSubmission: React.FC = () => {
  const {
    selectedFile,
    studentName,
    setStudentName,
    assignmentName,
    setAssignmentName,
    submissionStatus,
    paymentMethod,
    setPaymentMethod,
    amount,
    setAmount,
    loading,
    // Payment credentials
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    paypalEmail,
    setPaypalEmail,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    routingNumber,
    setRoutingNumber,
    // Functions
    handleFileChange,
    handleSubmit
  } = useAssignmentSubmission();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Assignment Submission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AssignmentForm
              studentName={studentName}
              setStudentName={setStudentName}
              assignmentName={assignmentName}
              setAssignmentName={setAssignmentName}
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
            />
            
            <PaymentSection
              amount={amount}
              setAmount={setAmount}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              // Credit Card fields
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvc={cardCvc}
              setCardCvc={setCardCvc}
              // PayPal fields
              paypalEmail={paypalEmail}
              setPaypalEmail={setPaypalEmail}
              // Bank Transfer fields
              bankName={bankName}
              setBankName={setBankName}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
              routingNumber={routingNumber}
              setRoutingNumber={setRoutingNumber}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#7E69AB] hover:bg-[#5D4E8A] text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit & Pay'}
            </Button>
            
            <StatusMessage status={submissionStatus} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSubmission;
