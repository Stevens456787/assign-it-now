
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertTriangle, CreditCard, DollarSign } from 'lucide-react';
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
      
      // Then, record the payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          assignment_id: assignmentData.id,
          amount,
          payment_method: paymentMethod,
          status: 'pending'
        });
      
      if (paymentError) {
        console.error('Payment recording error:', paymentError);
        throw new Error('Failed to process payment');
      }
      
      setSubmissionStatus('success');
      toast.success('Assignment submitted and payment initiated successfully!');
      
      // In a real app, we would redirect to an actual payment processing page
      // based on the selected payment method
      console.log('Payment details:', {
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
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </Label>
                  </div>
                </RadioGroup>
              </div>
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
                Assignment submitted and payment initiated!
              </div>
            )}
            
            {submissionStatus === 'error' && (
              <div className="flex items-center text-red-600 mt-4">
                <AlertTriangle className="mr-2" />
                Please fill in all fields and select a payment method.
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSubmission;
