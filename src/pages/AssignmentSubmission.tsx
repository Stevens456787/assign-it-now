
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertTriangle, CreditCard, DollarSign, Building } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AssignmentSubmission: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'bank_transfer'>('credit_card');
  const [amount, setAmount] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Payment credentials states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to submit an assignment');
        navigate('/auth');
      } else {
        setStudentName(session.user.user_metadata?.full_name || '');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!studentName || !assignmentName || !selectedFile || !paymentMethod) {
      setSubmissionStatus('error');
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate payment details based on selected method
    if (paymentMethod === 'credit_card' && (!cardNumber || !cardExpiry || !cardCvc)) {
      setSubmissionStatus('error');
      toast.error('Please fill in all credit card details');
      return;
    } else if (paymentMethod === 'paypal' && !paypalEmail) {
      setSubmissionStatus('error');
      toast.error('Please enter your PayPal email');
      return;
    } else if (paymentMethod === 'bank_transfer' && (!bankName || !accountNumber || !routingNumber)) {
      setSubmissionStatus('error');
      toast.error('Please fill in all bank transfer details');
      return;
    }

    try {
      setLoading(true);
      
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to submit an assignment');
        navigate('/auth');
        return;
      }
      
      // First, save assignment details
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert({
          user_id: session.user.id,
          title: assignmentName,
          status: 'submitted'
        })
        .select('id')
        .single();
      
      if (assignmentError) {
        console.error('Assignment submission error:', assignmentError);
        throw new Error('Failed to submit assignment');
      }
      
      // Then, record the payment with payment method details
      const paymentDetails = {
        user_id: session.user.id,
        assignment_id: assignmentData.id,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        // Store a masked version of sensitive payment data for demo purposes
        // In a real application, you would use a proper payment processor
        transaction_id: generateTransactionId(paymentMethod)
      };
      
      const { error: paymentError } = await supabase
        .from('payments')
        .insert(paymentDetails);
      
      if (paymentError) {
        console.error('Payment recording error:', paymentError);
        throw new Error('Failed to process payment');
      }
      
      setSubmissionStatus('success');
      toast.success('Assignment submitted and payment processed successfully!');
      
      // Log the payment method and masked credentials for demo purposes
      console.log('Payment processed with:', {
        method: paymentMethod,
        amount,
        assignmentId: assignmentData.id
      });
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      toast.error(error instanceof Error ? error.message : 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate a transaction ID for demo purposes
  const generateTransactionId = (method: string) => {
    const prefix = method === 'credit_card' ? 'CC' : 
                  method === 'paypal' ? 'PP' : 'BT';
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Function to render payment method specific fields
  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <div className="space-y-4 mt-3">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Expiration (MM/YY)</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="mt-3">
            <Label htmlFor="paypalEmail">PayPal Email</Label>
            <Input
              id="paypalEmail"
              type="email"
              placeholder="your@email.com"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className="mt-1"
            />
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="space-y-4 mt-3">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                placeholder="Enter routing number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
            <div>
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="assignmentName">Assignment Title</Label>
              <Input
                id="assignmentName"
                placeholder="Enter assignment name"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label>Upload Assignment</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 transition duration-300 cursor-pointer">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <Upload size={48} className="text-gray-500" />
                    <p className="pt-1 text-sm tracking-wider text-gray-400">
                      {selectedFile ? selectedFile.name : 'Select a file'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="opacity-0" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </label>
              </div>
            </div>
            
            {/* Payment Section */}
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
              
              <div className="mt-3">
                <Label>Payment Method</Label>
                <RadioGroup 
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as 'credit_card' | 'paypal' | 'bank_transfer')}
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
              
              {/* Render dynamic payment fields based on selected method */}
              {renderPaymentFields()}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#7E69AB] hover:bg-[#5D4E8A] text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit & Pay'}
            </Button>
            
            {submissionStatus === 'success' && (
              <div className="flex items-center text-green-600 mt-4">
                <CheckCircle className="mr-2" />
                Assignment submitted and payment processed!
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="flex items-center text-red-600 mt-4">
                <AlertTriangle className="mr-2" />
                Please fill in all required fields and payment information.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSubmission;
